/* Congress programme editor. Data is shared through the election Worker. */
const DEFAULT_CONGRESS_AGENDA={revision:0,venue:'Hội trường THPT Hồ Thị Bi',items:[
 {start:'07:30',end:'08:15',title:'Phiên 1: Điểm danh QR & Khai mạc Đại hội',description:'Chào cờ, tuyên bố lý do, giới thiệu đại biểu, bầu Đoàn Chủ tịch',action:'none'},
 {start:'08:15',end:'09:00',title:'Phiên 2: Trình bày Văn kiện & Thảo luận',description:'Báo cáo tổng kết, phương hướng nhiệm kỳ 2026-2027 & Đề án nhân sự',action:'documents'},
 {start:'09:00',end:'09:30',title:'Phiên 3: Bầu cử Ban Chấp hành (13 ứng viên)',description:'Bỏ phiếu tín nhiệm danh sách 13 ứng cử viên BCH',action:'bch'},
 {start:'09:30',end:'10:00',title:'Phiên 4: Bầu trực tiếp Bí thư Đoàn trường',description:'Bầu Bí thư khi Ban tổ chức mở vòng',action:'bithu'}
]};
const agendaUI={current:null,editing:null,dirty:false,signature:'',saving:false};
function cloneAgenda(value){return JSON.parse(JSON.stringify(value));}
function agendaElement(tag,className,text){const element=document.createElement(tag);element.className=className;if(text!==undefined)element.textContent=text;return element;}
function renderCongressAgenda(value){
 document.getElementById('congress-agenda-venue').textContent=value.venue;
 const list=document.getElementById('congress-agenda-list');list.replaceChildren();
 for(const item of value.items){
  const card=agendaElement('div','agenda-session agenda-tone-'+item.action);
  card.append(agendaElement('div','agenda-time',item.start+' - '+item.end));
  const content=agendaElement('div','agenda-session-content');content.append(agendaElement('h4','agenda-session-title',item.title));if(item.description)content.append(agendaElement('p','agenda-session-description',item.description));card.append(content);
  if(item.action!=='none'){
   const labels={documents:'Xem văn kiện →',bch:'Bầu BCH →',bithu:'Bầu Bí thư →'};
   const button=agendaElement('button','agenda-link',labels[item.action]);button.type='button';button.addEventListener('click',()=>{switchMainSection(item.action==='documents'?'documents':'voting');if(item.action==='bch'||item.action==='bithu')switchVotingTab(item.action);});card.append(button);
  }
  list.append(card);
 }
}
function applyCongressAgenda(saved){
 const value=saved||DEFAULT_CONGRESS_AGENDA;const signature=JSON.stringify(value);
 if(signature!==agendaUI.signature){agendaUI.current=cloneAgenda(value);agendaUI.signature=signature;renderCongressAgenda(value);}
 if(state.userRole!=='admin'){agendaUI.editing=null;agendaUI.dirty=false;return;}
 if(!agendaUI.editing||(!agendaUI.dirty&&!agendaUI.saving&&agendaUI.editing.revision!==value.revision)){agendaUI.editing=cloneAgenda(value);renderAgendaEditor();}
 if(agendaUI.dirty&&agendaUI.editing.revision!==value.revision)document.getElementById('agenda-editor-status').textContent='Có bản cập nhật mới trên máy chủ. Nạp lại trước khi lưu để tránh ghi đè.';
}
function collectAgendaEditor(){
 const value=cloneAgenda(agendaUI.editing||agendaUI.current||DEFAULT_CONGRESS_AGENDA);value.venue=document.getElementById('agenda-edit-venue').value.trim();
 value.items=[...document.querySelectorAll('#agenda-edit-items .agenda-edit-session')].map(row=>Object.fromEntries(['start','end','title','description','action'].map(key=>[key,row.querySelector('[data-field="'+key+'"]').value.trim()])));return value;
}
function markAgendaDirty(){agendaUI.dirty=true;document.getElementById('agenda-editor-status').textContent='Có thay đổi chưa lưu.';}
function renderAgendaEditor(){
 const value=agendaUI.editing;if(!value)return;document.getElementById('agenda-edit-venue').value=value.venue;
 const container=document.getElementById('agenda-edit-items');container.replaceChildren();
 value.items.forEach((item,index)=>{
  const row=agendaElement('fieldset','agenda-edit-session');row.innerHTML='<legend></legend><div class="agenda-edit-times"><label>Bắt đầu<input type="time" data-field="start" required></label><label>Kết thúc<input type="time" data-field="end" required></label></div><label>Tiêu đề phiên<input data-field="title" maxlength="180" required></label><label>Nội dung<textarea data-field="description" maxlength="600" rows="3"></textarea></label><label>Nút mở trang<select data-field="action"><option value="none">Không có</option><option value="documents">Văn kiện</option><option value="bch">Bầu BCH</option><option value="bithu">Bầu Bí thư</option></select></label><div class="agenda-edit-row-actions"></div>';
  row.querySelector('legend').textContent='Phiên '+(index+1);
  for(const key of ['start','end','title','description','action'])row.querySelector('[data-field="'+key+'"]').value=item[key];
  const actions=row.querySelector('.agenda-edit-row-actions');
  for(const [label,move,disabled] of [['↑ Lên',-1,index===0],['↓ Xuống',1,index===value.items.length-1],['Xóa',0,value.items.length===1]]){
   const button=agendaElement('button','agenda-secondary',label);button.type='button';button.disabled=disabled;button.addEventListener('click',()=>changeAgendaItem(index,move));actions.append(button);
  }
  container.append(row);
 });
 document.getElementById('agenda-add-session').disabled=value.items.length>=30;
 const status=document.getElementById('agenda-editor-status');status.textContent=agendaUI.dirty?'Có thay đổi chưa lưu.':value.updatedAt?'Đã lưu: '+formatVietnamCheckinTime(value.updatedAt):'Đang dùng chương trình mặc định. Chỉnh sửa và bấm Lưu chương trình.';
}
function changeAgendaItem(index,move){
 if(state.userRole!=='admin'||agendaUI.saving)return;agendaUI.editing=collectAgendaEditor();const items=agendaUI.editing.items;
 if(move){const target=index+move;if(target<0||target>=items.length)return;[items[index],items[target]]=[items[target],items[index]];}else{if(items.length<2)return;items.splice(index,1);}
 markAgendaDirty();renderAgendaEditor();
}
function addAgendaSession(){
 if(state.userRole!=='admin'||agendaUI.saving)return;agendaUI.editing=collectAgendaEditor();const items=agendaUI.editing.items;if(items.length>=30)return;items.push({start:items.at(-1)?.end||'07:30',end:'',title:'',description:'',action:'none'});markAgendaDirty();renderAgendaEditor();
 const input=document.querySelector('#agenda-edit-items .agenda-edit-session:last-child [data-field="title"]');input?.focus();
}
async function reloadAgendaEditor(){
 if(state.userRole!=='admin'||agendaUI.saving)return;if(agendaUI.dirty&&!confirm('Bỏ thay đổi chưa lưu và nạp chương trình mới nhất?'))return;
 return runElection(async()=>{await refreshElection();agendaUI.editing=cloneAgenda(agendaUI.current||DEFAULT_CONGRESS_AGENDA);agendaUI.dirty=false;renderAgendaEditor();});
}
async function saveCongressAgenda(event){
 event.preventDefault();if(state.userRole!=='admin'||agendaUI.saving||election.busy)return;const form=event.currentTarget;if(!form.reportValidity())return;
 const value=collectAgendaEditor();for(const item of value.items){if(item.end<=item.start){showToast('Giờ kết thúc phải sau giờ bắt đầu của từng phiên.','warning');return;}}
 return runElection(async()=>{
  agendaUI.saving=true;const controls=[...form.querySelectorAll('input,textarea,select,button')];const disabled=controls.map(e=>e.disabled);controls.forEach(e=>e.disabled=true);
  try{
   if(election.reading)await election.reading.catch(()=>{});const result=await electionRequest('agenda','PUT',value);agendaUI.dirty=false;agendaUI.editing=cloneAgenda(result.agenda);applyCongressAgenda(result.agenda);showToast('Đã lưu chương trình cho tất cả đại biểu.','success');
   try{await refreshElection();}catch{document.getElementById('agenda-editor-status').textContent='Đã lưu trên máy chủ; đang chờ tải lại trạng thái.';}
  }catch(error){agendaUI.dirty=true;document.getElementById('agenda-editor-status').textContent=error.status===404?'Cần cập nhật Worker 2.2 để lưu chương trình.':error.message;throw error;}
  finally{agendaUI.saving=false;controls.forEach((e,i)=>e.disabled=disabled[i]);if(!agendaUI.dirty)renderAgendaEditor();}
 });
}
document.getElementById('agenda-editor-form').addEventListener('input',markAgendaDirty);
document.getElementById('agenda-editor-form').addEventListener('change',markAgendaDirty);
document.getElementById('agenda-editor-form').addEventListener('submit',saveCongressAgenda);
document.getElementById('agenda-add-session').addEventListener('click',addAgendaSession);
document.getElementById('agenda-reload').addEventListener('click',reloadAgendaEditor);
