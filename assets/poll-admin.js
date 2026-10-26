/* Admin management of all quick polls, including historical polls. */
(() => {
 'use strict';
 if(document.getElementById('admin-polls-manager'))return;
 const css=document.createElement('style');css.textContent='.htb-poll-modal{width:min(720px,calc(100vw - 24px));max-height:calc(100dvh - 32px);margin:auto;border:0;border-radius:16px;padding:20px;overflow:auto;background:white;color:#0f172a}.htb-poll-modal::backdrop{background:#0f172acc}.htb-poll-modal h2{font-size:20px;font-weight:800;margin-bottom:12px}.htb-poll-modal input:not([type=checkbox]){display:block;width:100%;box-sizing:border-box;border:1px solid #94a3b8;border-radius:8px;padding:10px;margin:6px 0 12px}.htb-poll-modal label{display:block;margin-top:12px}.htb-poll-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.htb-poll-action{padding:10px 14px;min-height:44px;border:1px solid #0284c7;border-radius:9px;background:#f0f9ff;color:#075985;font-size:12px;font-weight:700;white-space:normal;max-width:100%;cursor:pointer}.htb-poll-danger{border-color:#e11d48;background:#fff1f2;color:#9f1239}.htb-poll-action:disabled{opacity:.5;cursor:not-allowed}.htb-poll-card{padding:14px;border:1px solid #cbd5e1;border-radius:10px;margin-top:12px;overflow-wrap:anywhere}.htb-poll-status{white-space:pre-wrap;color:#be123c;margin:10px 0}';document.head.append(css);
 const manager=document.createElement('dialog');manager.id='admin-polls-manager';manager.className='htb-poll-modal';manager.setAttribute('aria-labelledby','poll-manager-title');
 manager.innerHTML='<h2 id="poll-manager-title">Quản lý biểu quyết đã tạo</h2><p>Xóa từng biểu quyết cùng phiếu đã gửi của biểu quyết đó. Giữ phiếu bầu BCH/Bí thư và danh sách đại biểu.</p><div class="htb-poll-actions"><button type="button" class="htb-poll-action" id="poll-manager-refresh">Tải lại danh sách</button><button type="button" class="htb-poll-action" id="poll-manager-close">Đóng cửa sổ</button></div><p role="status" class="htb-poll-status" id="poll-manager-message"></p><div id="poll-manager-list"></div>';
 document.body.append(manager);
 const confirmDialog=document.createElement('dialog');confirmDialog.id='admin-poll-delete-dialog';confirmDialog.className='htb-poll-modal';confirmDialog.setAttribute('aria-labelledby','poll-delete-title');
 confirmDialog.innerHTML='<form><h2 id="poll-delete-title">Xóa biểu quyết</h2><p id="poll-delete-summary"></p><p class="htb-poll-status">Xóa vĩnh viễn nội dung và toàn bộ phiếu của biểu quyết đang chọn.</p><button type="button" class="htb-poll-action" id="poll-delete-backup">1. Tải bản sao lưu biểu quyết</button><label><input type="checkbox" id="poll-delete-saved" required> Tôi đã lưu và kiểm tra bản sao lưu.</label><label for="poll-delete-password">Mật khẩu quản trị</label><input id="poll-delete-password" type="password" autocomplete="current-password" required maxlength="128"><label for="poll-delete-confirm">Nhập chính xác: XOA BIEU QUYET</label><input id="poll-delete-confirm" type="text" autocomplete="off" required><p role="status" class="htb-poll-status" id="poll-delete-message"></p><div class="htb-poll-actions"><button type="submit" class="htb-poll-action htb-poll-danger" id="poll-delete-submit" disabled>2. Xóa biểu quyết và phiếu</button><button type="button" class="htb-poll-action" id="poll-delete-cancel">Hủy</button></div></form>';
 document.body.append(confirmDialog);
 const el=id=>document.getElementById(id);let selected=null,backup=null,busy=false,listing=false;
 const show=(id,text)=>{el(id).textContent=text;};
 function update(){el('poll-delete-submit').disabled=busy||!backup||!el('poll-delete-saved').checked||!el('poll-delete-password').value||el('poll-delete-confirm').value!=='XOA BIEU QUYET';el('poll-delete-backup').disabled=busy;el('poll-delete-cancel').disabled=busy;}
 function dismiss(){if(busy)return;confirmDialog.close();confirmDialog.querySelector('form').reset();backup=null;}
 function select(poll){if(busy||election.role!=='admin')return;selected=poll;backup=null;confirmDialog.querySelector('form').reset();show('poll-delete-summary',poll.title+' — '+poll.votes+' phiếu.');show('poll-delete-message','');update();confirmDialog.showModal();el('poll-delete-backup').focus();}
 function button(label,fn,danger=false){const b=document.createElement('button');b.type='button';b.className='htb-poll-action'+(danger?' htb-poll-danger':'');b.textContent=label;b.onclick=fn;return b;}
 async function load(){
  if(listing)return;listing=true;show('poll-manager-message','Đang tải toàn bộ biểu quyết…');el('poll-manager-refresh').disabled=true;
  try{const data=await electionRequest('polls/manage');const list=el('poll-manager-list');list.replaceChildren();
   show('poll-manager-message',data.polls.length?'Có '+data.polls.length+' biểu quyết. Đóng biểu quyết đang mở trước khi xóa.':'Không còn biểu quyết đã tạo. Có thể thử xóa danh sách đại biểu lại.');
   for(const poll of data.polls){const card=document.createElement('div');card.className='htb-poll-card';const title=document.createElement('h3');title.textContent=poll.title;const info=document.createElement('p');info.textContent=(poll.status==='open'?'Đang mở':'Đã đóng')+' · '+poll.votes+' phiếu · Tạo lúc '+poll.created_at;const actions=document.createElement('div');actions.className='htb-poll-actions';
    if(poll.status==='open')actions.append(button('Đóng biểu quyết',async event=>{event.currentTarget.disabled=true;try{await electionRequest('polls/'+poll.id+'/close','POST',{});await load();await refreshElection();}catch(e){show('poll-manager-message',e.message);event.target.disabled=false;}}));
    const remove=button('Sao lưu và xóa biểu quyết',()=>select(poll),true);remove.disabled=poll.status!=='closed';actions.append(remove);card.append(title,info,actions);list.append(card);
   }
  }catch(e){show('poll-manager-message',e.status===404?'Worker chưa có chức năng quản lý biểu quyết. Cập nhật Worker 3.1.4-polls trong gói mới.':e.message);}
  finally{listing=false;el('poll-manager-refresh').disabled=false;}
 }
 async function open(){if(election.role!=='admin')return;const roster=el('admin-roster-delete-dialog');if(roster?.open){if(el('roster-cancel').disabled)return;el('roster-cancel').click();}if(!manager.open)manager.showModal();await load();}
 el('poll-manager-refresh').onclick=load;el('poll-manager-close').onclick=()=>manager.close();el('poll-delete-cancel').onclick=dismiss;
 confirmDialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});confirmDialog.addEventListener('input',update);confirmDialog.addEventListener('change',update);
 el('poll-delete-backup').onclick=async()=>{if(busy||!selected)return;busy=true;backup=null;el('poll-delete-saved').checked=false;update();show('poll-delete-message','Đang tạo bản sao lưu…');try{const data=await electionRequest('polls/'+selected.id+'/delete-preview');downloadJson('SAO_LUU_BIEU_QUYET_'+selected.id+'.json',data);backup=data;show('poll-delete-message','Đã yêu cầu tải bản sao lưu '+data.votes.length+' phiếu. Kiểm tra tệp trước khi xác nhận.');}catch(e){show('poll-delete-message',e.message);}finally{busy=false;update();}};
 confirmDialog.querySelector('form').onsubmit=async event=>{
  event.preventDefault();update();if(el('poll-delete-submit').disabled||election.role!=='admin')return;const password=el('poll-delete-password').value;el('poll-delete-password').value='';busy=true;update();show('poll-delete-message','Đang xóa biểu quyết…');
  try{await electionRequest('polls/'+selected.id+'/delete','POST',{revision:backup.revision,password,confirm:'XOA BIEU QUYET'});busy=false;dismiss();showToast('Đã xóa biểu quyết và các phiếu liên quan.','success');await load();try{await refreshElection();}catch{show('poll-manager-message','Đã xóa biểu quyết. Tải lại trang để cập nhật toàn bộ trạng thái.');}}
  catch(e){backup=null;show('poll-delete-message',e.message+' Tải lại trạng thái và sao lưu mới trước khi thử tiếp.');}finally{busy=false;update();}
 };
 function mount(){
  for(const [id,target] of [['admin-poll-manager-button',el('admin-roster-delete-actions')],['poll-dialog-manager-button',el('op-poll-admin')],['roster-dialog-poll-manager-button',el('roster-message')?.parentElement]]){
   let b=el(id);if(!b&&target){b=button('Quản lý biểu quyết đã tạo',open);b.id=id;target.append(b);}if(b)b.hidden=election.role!=='admin';
  }
 }
 const previous=renderRolePermissions;renderRolePermissions=function(...args){const value=previous.apply(this,args);mount();if(election.role!=='admin'){manager.close();if(!busy)dismiss();}return value;};mount();
})();
