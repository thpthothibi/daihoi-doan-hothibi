/* Authoritative election bridge, version 2.1. No ballot is accepted locally. */
const election={token:sessionStorage.getItem('htb_session_v2')||'',role:null,rounds:[],results:null,busy:false,ready:false,reading:null,counts:{total:0,checkedIn:0},directory:[],directoryRevision:'',viewSignature:'',resultSignature:'',pollTimer:null,pollFailures:0,lastPoll:0};
const guest={code:'—',name:'Chưa xác thực đại biểu',className:'—',checkedIn:false,votedBch:false,votedBiThu:false};
async function electionRequest(path,method='GET',body,authenticated=true){
 if(!docsCloud.apiBase)throw new Error('Chưa cấu hình địa chỉ Worker.');
 const headers={};if(body!==undefined)headers['Content-Type']='application/json';if(authenticated&&election.token)headers.Authorization='Bearer '+election.token;
 let response;try{response=await fetch(docsCloud.apiBase+'/api/election/'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(20000)});}catch{throw new Error('Không nhận được xác nhận từ máy chủ. Kiểm tra mạng rồi thử lại; phiếu chưa được báo thành công.');}
 const data=await response.json().catch(()=>({error:'Máy chủ trả dữ liệu không hợp lệ.'}));if(!response.ok){if(response.status===401&&authenticated){clearElectionSession();}const error=new Error(data.error||'Không xử lý được yêu cầu.');error.status=response.status;throw error;}return data;
}
function clearElectionSession(){election.token='';election.role=null;election.results=null;docsCloud.token='';sessionStorage.removeItem('htb_session_v2');state.sessionConfirmed=false;state.userRole='delegate';state.delegates=[];state.currentVoterIndex=0;election.viewSignature='';election.resultSignature='';renderRolePermissions();switchMainSection('overview');renderVoterBar();openQrLoginModal();}
function getCurrentVoter(){return state.delegates[state.currentVoterIndex]||guest;}
function loadSavedState(){
 state.sessionConfirmed=false;state.userRole='delegate';state.delegates=[];state.candidatesBch=[];state.candidatesBiThu=[];state.bchDraftSelectedIds=new Set();state.biThuDraftSelectedIds=new Set();state.biThuUnlockedSession=false;state.docViewerMode='iframe';
 try{const cached=JSON.parse(localStorage.getItem('htb_documents_cache_v2')||'null');if(cached?.documents){state.documents=cached.documents.map(asCloudDocument).filter(Boolean);docsCloud.wasCloudCache=true;}else state.documents=[];}catch{state.documents=[];}
 // The old browser database is retained only as an explicit backup, never restored as authority.
 try{const old=JSON.parse(localStorage.getItem('htb_election_state_v2')||'null');if(old){delete old.config?.adminPassword;delete old.config?.bchAccountPassword;delete old.config?.biThuPassword;old.userRole='delegate';old.sessionConfirmed=false;localStorage.setItem('htb_election_state_v2',JSON.stringify(old));}}catch{}
}
function saveState(){try{if(docsCloud.loaded)localStorage.setItem('htb_documents_cache_v2',JSON.stringify({documents:state.documents.map(d=>({id:d.id,title:d.title,category:d.category,driveFileId:d.driveFileId,size:d.size,summary:d.summary||'',updatedAt:d.updatedAt})),at:docsCloud.lastSync}));}catch{}}
function syncDraftWithCurrentVoter(){state.bchDraftSelectedIds=new Set();state.biThuDraftSelectedIds=new Set();election.draftKeys={};election.viewSignature='';}
function initializeElectionDrafts(){
 const voter=getCurrentVoter();election.draftKeys??={};
 for(const [round,candidates,key,voted] of [['bch',state.candidatesBch,'bchDraftSelectedIds','votedBch'],['bithu',state.candidatesBiThu,'biThuDraftSelectedIds','votedBiThu']]){
  const identity=JSON.stringify([election.role,voter.code,candidates]);
  if(election.draftKeys[round]!==identity){state[key]=new Set(election.role==='delegate'&&!voter[voted]?candidates.map(c=>c.id):[]);election.draftKeys[round]=identity;}
 }
}
function applyElection(data){
 const viewSignature=JSON.stringify([data.role,data.rounds,data.delegates,data.presentation]);
 const viewChanged=viewSignature!==election.viewSignature;
 const resultSignature=JSON.stringify([data.results,data.counts]);
 const resultChanged=resultSignature!==election.resultSignature;
 election.ready=true;election.role=data.role;election.rounds=data.rounds;election.counts=data.counts;state.userRole=data.role||'delegate';state.sessionConfirmed=!!data.role;state.delegates=data.delegates||[];state.currentVoterIndex=0;
 const b=data.rounds.find(r=>r.name==='bch'),secretary=data.rounds.find(r=>r.name==='bithu');state.candidatesBch=b?.config.candidates||[];state.candidatesBiThu=secretary?.config.candidates||[];state.config.bchElectedQuota=b?.config.quota||1;state.config.bchMaxSelectAllowed=b?.config.max||1;state.config.biThuGateMode=secretary?.status==='open'?'OPEN':'WAIT_TIME';state.biThuUnlockedSession=secretary?.status==='open';docsCloud.token=data.role==='admin'?election.token:'';
 if(viewChanged&&data.presentation&&!document.activeElement?.id.startsWith('admin-qr-')){Object.assign(state.config,data.presentation);syncGateQrUrlInput(state.config.gateQrUrl);updateGateQrLabel(state.config.gateQrLabel);updateAdminQrCardPreview();}
 initializeElectionDrafts();
 if(data.results)election.results=data.results;
 for(const receipt of data.receipts||[])sessionStorage.setItem('htb_receipt:'+getCurrentVoter().code+':'+receipt.round,receipt.receipt);
 for(const [set,candidates] of [[state.bchDraftSelectedIds,state.candidatesBch],[state.biThuDraftSelectedIds,state.candidatesBiThu]])for(const id of set)if(!candidates.some(c=>c.id===id))set.delete(id);
 if(viewChanged){renderRolePermissions();renderVoterBar();renderBchVotingGrid();renderBiThuVotingSection();onQrDelegateSelectionChange();}
 if(['admin','bch'].includes(data.role)&&(viewChanged||resultChanged)&&state.mainSection==='excel')renderExcelSection();
 renderElectionStatus();const voter=getCurrentVoter();const receipts=[];for(const [round,key] of [['bch','votedBch'],['bithu','votedBiThu']]){const receipt=sessionStorage.getItem('htb_receipt:'+voter.code+':'+round);if(voter[key]&&receipt)receipts.push(round.toUpperCase()+': '+receipt);}document.getElementById('vote-receipt').textContent=receipts.length?'Mã xác nhận phiếu máy chủ đã nhận: '+receipts.join(' • '):'';
 election.viewSignature=viewSignature;election.resultSignature=resultSignature;election.lastPoll=Date.now();election.pollFailures=0;
}

async function refreshElection(){if(election.reading)return election.reading;election.reading=(async()=>{const requestToken=election.token;let data=await electionRequest(['admin','bch'].includes(election.role)?'results':'state');if(requestToken===election.token&&['admin','bch'].includes(data.role)&&!data.results)data=await electionRequest('results');if(requestToken===election.token)applyElection(data);return data;})();try{return await election.reading;}finally{election.reading=null;}}
function renderElectionStatus(message){
 const el=document.getElementById('election-status');if(el)el.textContent=message||`Máy chủ đã kết nối • ${election.counts.checkedIn}/${election.counts.total} đã điểm danh • BCH: ${election.rounds.find(r=>r.name==='bch')?.status==='open'?'Đang mở':'Đóng'} • Bí thư: ${election.rounds.find(r=>r.name==='bithu')?.status==='open'?'Đang mở':'Đóng'}`;
 for(const id of ['sys-delegate-count','excel-import-delegate-count','admin-qr-checkin-summary','drawer-checkin-stat']){const e=document.getElementById(id);if(e)e.textContent=`${election.counts.checkedIn}/${election.counts.total} đại biểu`;}
 document.getElementById('gate-checkin-status-pill').textContent=getCurrentVoter().checkedIn?'● Đã được máy chủ xác nhận':'○ Chưa xác thực';
 document.getElementById('btn-close-qr-gate').classList.toggle('hidden',!state.sessionConfirmed);
 document.querySelectorAll('[onclick^="confirmDelegateQrLogin"]').forEach(e=>e.disabled=!canEnterSelectedDelegate());
 for(const r of election.rounds){const badge=document.getElementById('round-status-'+r.name);if(badge)badge.textContent=`${r.status==='open'?'ĐANG MỞ':'ĐANG ĐÓNG'} • ${r.config.candidates.length} ứng viên • Chọn ${r.config.min}–${r.config.max}`;}
}
async function runElection(action){if(election.busy)return;election.busy=true;document.body.setAttribute('aria-busy','true');try{return await action();}catch(e){showToast(e.message,'error');renderElectionStatus(e.message);}finally{election.busy=false;document.body.removeAttribute('aria-busy');onQrDelegateSelectionChange();}}
async function enterSession(data){if(election.reading)await election.reading.catch(()=>{});election.token=data.token;election.role=data.role;sessionStorage.setItem('htb_session_v2',data.token);syncDraftWithCurrentVoter();await refreshElection();}
async function submitAdminLogin(){return runElection(async()=>{const input=document.getElementById('admin-login-password');try{await enterSession(await electionRequest('login','POST',{role:state.selectedLoginRole,password:input.value},false));}finally{input.value='';}closeAdminLoginModal();document.getElementById('modal-qr-login').classList.add('hidden');document.getElementById('modal-qr-login').classList.remove('flex');switchMainSection(election.role==='admin'?'admin':'excel');showToast('Máy chủ đã xác thực tài khoản.','success');});}
function selectedDelegate(){return election.directory.find(d=>d.code===document.getElementById('qr-select-delegate')?.value&&d.className===document.getElementById('qr-select-class')?.value);}
function canEnterSelectedDelegate(){const d=selectedDelegate();return !!(state.sessionConfirmed&&election.role==='delegate'&&getCurrentVoter().checkedIn&&d?.code===getCurrentVoter().code);}
async function loadDelegateDirectory(force=false){
 if(election.directoryReading)return election.directoryReading;
 election.directoryReading=(async()=>{const data=await electionRequest('directory','GET',undefined,false);if(!Array.isArray(data.delegates))throw new Error('Danh sách đại biểu không hợp lệ.');
 if(force||data.revision!==election.directoryRevision){election.directory=data.delegates;election.directoryRevision=data.revision;populateQrClasses();}return data;})();
 try{return await election.directoryReading;}finally{election.directoryReading=null;}
}

function addOption(select,value,label){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
function populateQrClasses(){
 const select=document.getElementById('qr-select-class');const current=select.value||getCurrentVoter().className;select.replaceChildren();addOption(select,'','-- Chọn lớp / chi đoàn --');
 const classes=[...new Set(election.directory.map(d=>d.className))].sort((a,b)=>a.localeCompare(b,'vi',{numeric:true}));for(const c of classes)addOption(select,c,c);
 if(classes.includes(current))select.value=current;select.disabled=!classes.length;populateQrDelegateSelect();
}
function populateQrDelegateSelect(){
 const select=document.getElementById('qr-select-delegate');if(!select)return;const previous=select.value;const cls=document.getElementById('qr-select-class').value;select.replaceChildren();addOption(select,'',cls?'-- Chọn họ và tên --':'-- Chọn lớp trước --');
 const list=election.directory.filter(d=>d.className===cls);const duplicateNames=new Map();for(const d of list)duplicateNames.set(d.name,(duplicateNames.get(d.name)||0)+1);
 for(const d of list)addOption(select,d.code,d.name+(duplicateNames.get(d.name)>1?' ('+d.code+')':''));
 const preferred=list.some(d=>d.code===previous)?previous:(getCurrentVoter().className===cls?getCurrentVoter().code:'');select.value=preferred;select.disabled=!cls||!list.length;onQrDelegateSelectionChange();
}
function onQrDelegateSelectionChange(){
 const selected=selectedDelegate();const own=selected?.code===getCurrentVoter().code&&state.sessionConfirmed;const d=own?getCurrentVoter():selected;
 document.getElementById('gate-delegate-avatar').textContent=d?.code||'—';document.getElementById('qr-login-preview-name').textContent=d?.name||'Chọn lớp và họ tên';document.getElementById('qr-login-preview-unit').textContent=d?'Chi đoàn: '+d.className:'';
 const confirmed=own&&getCurrentVoter().checkedIn;const pill=document.getElementById('gate-checkin-status-pill');pill.textContent=confirmed?'● Đã điểm danh':'○ Chưa điểm danh';pill.className='px-2.5 py-0.5 rounded-full text-[11px] font-bold '+(confirmed?'bg-emerald-100 text-emerald-800 border border-emerald-200':'bg-amber-100 text-amber-800 border border-amber-200');
 document.getElementById('gate-checkin-time-label').textContent=confirmed?'Điểm danh: '+formatVietnamCheckinTime(getCurrentVoter().checkedInAt):'';
 const canEnter=canEnterSelectedDelegate();document.querySelectorAll('#modal-qr-login button[onclick^="confirmDelegateQrLogin"]').forEach(button=>button.disabled=!canEnter);document.getElementById('btn-close-qr-gate').classList.toggle('hidden',!state.sessionConfirmed);
 const button=document.querySelector('[onclick="confirmDelegateCheckinStep()"]');if(button){button.disabled=!selected||election.busy;button.textContent=confirmed?'Vào trang Đại hội':'Xác nhận điểm danh';}
}
function openQrLoginModal(){const modal=document.getElementById('modal-qr-login');modal.dataset.scanned=String(new URLSearchParams(location.search).get('gate')==='checkin');modal.classList.remove('hidden');modal.classList.add('flex');populateQrClasses();if(election.configured&&!election.directory.length)loadDelegateDirectory().catch(e=>showToast(e.message,'error'));}
async function confirmDelegateCheckinStep(){
 if(election.busy)return;const selected=selectedDelegate();if(!selected){showToast('Chọn lớp và họ tên trước khi xác nhận.','warning');return;}
 if(canEnterSelectedDelegate()){confirmDelegateQrLogin('overview');return;}
 if(state.sessionConfirmed&&election.role==='delegate'&&getCurrentVoter().code!==selected.code&&!confirm('Chuyển sang đại biểu '+selected.name+'?'))return;
 return runElection(async()=>{const oldToken=election.token;const data=await electionRequest('checkin','POST',{code:selected.code,className:selected.className},false);await enterSession(data);if(oldToken&&oldToken!==data.token)fetch(docsCloud.apiBase+'/api/election/logout',{method:'POST',headers:{Authorization:'Bearer '+oldToken},signal:AbortSignal.timeout(5000)}).catch(()=>{});onQrDelegateSelectionChange();document.getElementById('modal-qr-login').classList.add('hidden');document.getElementById('modal-qr-login').classList.remove('flex');switchMainSection('overview');showToast('Đã điểm danh: '+getCurrentVoter().name,'success');});
}
function confirmDelegateQrLogin(targetSection='overview'){if(!canEnterSelectedDelegate()){showToast('Chọn đúng đại biểu đã điểm danh hoặc xác nhận điểm danh trước.','warning');return;}document.getElementById('modal-qr-login').classList.add('hidden');document.getElementById('modal-qr-login').classList.remove('flex');switchMainSection(targetSection);}

async function logoutCurrentSession(){return runElection(async()=>{await electionRequest('logout','POST',{});clearElectionSession();syncDraftWithCurrentVoter();switchMainSection('overview');openQrLoginModal();renderElectionStatus('Đã đăng xuất.');});}
async function submitChangePassword(){return runElection(async()=>{const p=document.getElementById('change-pass-new').value;if(p!==document.getElementById('change-pass-confirm').value)throw new Error('Xác nhận mật khẩu chưa khớp.');const data=await electionRequest('password','POST',{role:document.getElementById('change-pass-target-role').value,oldPassword:document.getElementById('change-pass-old').value,newPassword:p});for(const id of ['change-pass-new','change-pass-old','change-pass-confirm'])document.getElementById(id).value='';closeChangePasswordModal();if(data.relogin){clearElectionSession();switchMainSection('overview');openAdminLoginModal();}showToast('Đã đổi mật khẩu trên máy chủ; các phiên của tài khoản này đã bị thu hồi.','success');});}
function validDraft(round){const r=election.rounds.find(r=>r.name===round),ids=[...(round==='bch'?state.bchDraftSelectedIds:state.biThuDraftSelectedIds)];if(!election.ready||!state.sessionConfirmed||election.role!=='delegate')throw new Error('Vui lòng xác thực đại biểu trước.');if(r?.status!=='open')throw new Error('Ban tổ chức chưa mở vòng bầu cử này.');if(ids.length<r.config.min||ids.length>r.config.max)throw new Error(`Chỉ chọn từ ${r.config.min} đến ${r.config.max} ứng viên.`);return ids;}
async function submitServerBallot(round){return runElection(async()=>{
 const ids=validDraft(round);const key='htb_pending_vote:'+getCurrentVoter().code+':'+round;let pending;try{pending=JSON.parse(sessionStorage.getItem(key));}catch{}if(!pending||JSON.stringify(pending.selections)!==JSON.stringify(ids)||pending.version!==election.rounds.find(r=>r.name===round).version)pending={round,selections:ids,version:election.rounds.find(r=>r.name===round).version,requestId:crypto.randomUUID()};sessionStorage.setItem(key,JSON.stringify(pending));
 const result=await electionRequest('vote','POST',pending);sessionStorage.removeItem(key);sessionStorage.setItem('htb_receipt:'+getCurrentVoter().code+':'+round,result.receipt);
 closeConfirmBchModal();const voter=getCurrentVoter();voter[round==='bch'?'votedBch':'votedBiThu']=true;renderVoterBar();renderBchVotingGrid();renderBiThuVotingSection();document.getElementById('vote-receipt').textContent='Máy chủ đã nhận phiếu '+(round==='bch'?'BCH':'Bí thư')+'. Mã xác nhận: '+result.receipt;showToast('Máy chủ đã nhận phiếu.','success');try{await refreshElection();}catch{renderElectionStatus('Máy chủ đã nhận phiếu; đang chờ tải lại trạng thái. Mã xác nhận đã lưu trong phiên.');}
});}
function confirmSubmitBchBallot(){return submitServerBallot('bch');}
function submitBiThuBallot(){try{validDraft('bithu');if(!confirm('Xác nhận nộp phiếu Bí thư? Sau khi máy chủ nhận, phiếu không thể sửa.'))return;}catch(e){showToast(e.message,'error');return;}return submitServerBallot('bithu');}
function openConfirmBchModal(){try{validDraft('bch');if(getCurrentVoter().votedBch)throw new Error('Đã nộp phiếu BCH.');document.getElementById('modal-bch-voter-name').textContent=getCurrentVoter().name;document.getElementById('modal-bch-keep-count').textContent=state.bchDraftSelectedIds.size;document.getElementById('modal-bch-unselected-list').textContent=state.candidatesBch.filter(c=>!state.bchDraftSelectedIds.has(c.id)).map(c=>c.name).join(', ')||'Không có';document.getElementById('modal-confirm-bch').classList.remove('hidden');document.getElementById('modal-confirm-bch').classList.add('flex');}catch(e){showToast(e.message,'warning');}}
function unlockBiThuTab(){refreshElection().catch(e=>showToast(e.message,'error'));}
function resetBchAllSelected(){if(getCurrentVoter().votedBch)return;state.bchDraftSelectedIds=new Set(state.candidatesBch.map(c=>c.id));renderBchVotingGrid();}
function resetBiThuAllSelected(){if(getCurrentVoter().votedBiThu)return;state.biThuDraftSelectedIds=new Set(state.candidatesBiThu.map(c=>c.id));renderBiThuVotingSection();}
function selectBiThuCandidate(id){if(getCurrentVoter().votedBiThu)return;const set=state.biThuDraftSelectedIds;if(set.has(id))set.delete(id);else set.add(id);renderBiThuVotingSection();}
function toggleBchCandidate(id){if(getCurrentVoter().votedBch)return;const set=state.bchDraftSelectedIds;if(set.has(id))set.delete(id);else set.add(id);renderBchVotingGrid();}
function computeElectionTally(){
 const b=election.results?.bch||{turnout:0,counts:{}},s=election.results?.bithu||{turnout:0,counts:{}};
 const rankedBch=state.candidatesBch.map(c=>({...c,agree:b.counts[c.id]||0,reject:b.turnout-(b.counts[c.id]||0),pct:b.turnout?+((b.counts[c.id]||0)*100/b.turnout).toFixed(1):0})).sort((a,b)=>b.agree-a.agree||a.id-b.id);
 rankedBch.forEach((c,i)=>{c.rank=i+1;c.isElected=b.turnout>0&&c.agree>b.turnout/2&&i<state.config.bchElectedQuota&&!(rankedBch[state.config.bchElectedQuota]?.agree===rankedBch[state.config.bchElectedQuota-1]?.agree&&c.agree===rankedBch[state.config.bchElectedQuota-1]?.agree);});
 const biThuResults=state.candidatesBiThu.map(c=>({...c,votes:s.counts[c.id]||0,reject:s.turnout-(s.counts[c.id]||0),pct:s.turnout?+((s.counts[c.id]||0)*100/s.turnout).toFixed(1):0})).sort((a,b)=>b.votes-a.votes);
 return {bchTurnout:b.turnout,biThuTurnout:s.turnout,rankedBch,biThuResults};
}
function downloadJson(name,value){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
async function importDelegatesFromExcelFile(){return runElection(async()=>{const input=document.getElementById('excel-delegate-file-input');const file=input?.files[0];if(!file)throw new Error('Chọn tệp Excel/CSV trước.');if(file.size>300000)throw new Error('Tệp tối đa 300 KB.');await ensureVendor('xlsx');const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});const delegates=rows.map((r,i)=>({code:String(r['Mã ĐB']||r['Mã đại biểu']||r.code||'ĐB-'+String(i+1).padStart(3,'0')),name:String(r['Họ và tên']||r['Họ tên']||r.name||''),className:String(r['Chi đoàn']||r['Lớp']||r.className||'')}));if(!confirm('Nhập '+delegates.length+' đại biểu? Mã trùng sẽ bị từ chối. Các trạng thái điểm danh/phiếu cũ trong tệp không được nhập.'))return;await electionRequest('roster','POST',{delegates});await Promise.all([loadDelegateDirectory(true),refreshElection()]);showToast('Đã nhập '+delegates.length+' đại biểu. Đại biểu chọn lớp và họ tên để điểm danh.','success');});}
async function downloadSampleDelegateExcel(){await ensureVendor('xlsx');const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet([{'Mã ĐB':'ĐB-001','Họ và tên':'Điền họ tên thật','Chi đoàn':'12A1'}]),'Dai_bieu');XLSX.writeFile(wb,'MAU_DAI_BIEU.xlsx');}
async function downloadAccessFile(access){election.newAccess=access;await ensureVendor('xlsx');const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(access.map(d=>({'Mã ĐB':d.code,'Họ và tên':d.name,'Chi đoàn':d.className,'Mã kích hoạt riêng':d.activation}))),'Ma_kich_hoat');XLSX.writeFile(wb,'MA_KICH_HOAT_DAI_BIEU_BAO_MAT.xlsx');}
async function restoreAccessDownload(){if(!election.newAccess){showToast('Mã chỉ được trả một lần sau khi nhập. Hãy giữ tệp đã tải; máy chủ chỉ lưu bản băm.','warning');return;}return runElection(()=>downloadAccessFile(election.newAccess));}
async function resetDelegateAccess(){return runElection(async()=>{const code=document.getElementById('reissue-delegate-code').value.trim().toUpperCase();if(!code)throw new Error('Nhập mã đại biểu cần cấp lại.');if(!confirm('Cấp lại mã cho '+code+' và thu hồi phiên đăng nhập cũ? Phiếu đã nhận vẫn được giữ nguyên.'))return;const result=await electionRequest('delegates/'+encodeURIComponent(code)+'/activation','POST',{});election.newAccess=result.access;await downloadAccessFile(result.access);showToast('Đã cấp lại mã; phiên cũ đã bị thu hồi.','success');});}

function loadRoundEditor(name){const r=election.rounds.find(r=>r.name===name);if(!r)return;document.getElementById('round-candidates-'+name).value=r.config.candidates.map(c=>[c.name,c.unit,c.role||c.bio||''].join('|')).join('\n');for(const key of ['min','max','quota'])document.getElementById('round-'+key+'-'+name).value=r.config[key];}
function seedRoundEditor(name){const candidates=name==='bch'?INITIAL_BCH_CANDIDATES:INITIAL_SECRETARY_CANDIDATES;document.getElementById('round-candidates-'+name).value=candidates.map(c=>[c.name,c.unit,c.role||c.bio||''].join('|')).join('\n');document.getElementById('round-min-'+name).value=0;document.getElementById('round-max-'+name).value=name==='bch'?candidates.length:1;document.getElementById('round-quota-'+name).value=name==='bch'?Math.min(11,candidates.length):1;}
async function saveRoundEditor(name){return runElection(async()=>{const lines=document.getElementById('round-candidates-'+name).value.trim().split('\n');const candidates=lines.map((line,i)=>{const [name,unit,role='']=line.split('|').map(x=>x.trim());return {id:i+1,name,unit,role,bio:role};});const config={candidates};for(const key of ['min','max','quota'])config[key]=Number(document.getElementById('round-'+key+'-'+name).value);await electionRequest('rounds/'+name,'PUT',{config,status:'closed'});await refreshElection();showToast('Đã lưu quy chế và danh sách trên máy chủ.','success');});}
async function setRoundStatus(name,status){return runElection(async()=>{if(!confirm((status==='open'?'Mở':'Đóng')+' vòng '+(name==='bch'?'BCH':'Bí thư')+' trên tất cả thiết bị?'))return;await electionRequest('rounds/'+name,'PUT',{status});await refreshElection();showToast('Đã cập nhật trạng thái vòng bầu cử.','success');});}
function blockedLegacy(){showToast('Sử dụng mục Điều hành máy chủ. Chức năng giả lập/xóa phiếu đã được gỡ khỏi bản vận hành.','warning');}
for(const name of ['simulateAll100Checkin','simulateConcurrentVoters','confirmResetElection','fillAndUnlockDemoPass','saveAdminBiThuConfig','updateAdminQuotaSetting','saveEditedCandidates','saveEditedBiThuCandidates','addNewBiThuCandidate','removeBiThuCandidate','openResetConfirmModal'])window[name]=blockedLegacy;
async function exportServerBackup(){return runElection(async()=>{await refreshElection();downloadJson('BAO_CAO_TAP_TRUNG_'+new Date().toISOString().slice(0,10)+'.json',{at:new Date().toISOString(),counts:election.counts,rounds:election.rounds,results:election.results,delegates:state.delegates,audit:await electionRequest('audit')});});}
function exportLegacyBackup(){const data=localStorage.getItem('htb_election_state_v2');if(data)downloadJson('SAO_LUU_DU_LIEU_CU_CHUA_XAC_MINH.json',JSON.parse(data));else showToast('Trình duyệt này không có dữ liệu cũ.','info');}
window.addEventListener('DOMContentLoaded',async()=>{
 const banner=document.createElement('div');banner.id='election-status';banner.setAttribute('role','status');banner.style.cssText='position:sticky;top:0;z-index:35;padding:9px 14px;background:#e0f2fe;color:#075985;font-size:12px;font-weight:700;border-bottom:1px solid #bae6fd';banner.textContent='Đang kiểm tra kết nối máy chủ…';document.querySelector('main').prepend(banner);
 for(const label of document.querySelectorAll('label')){const input=label.parentElement.querySelector('input,select,textarea');if(input?.id)label.htmlFor=input.id;}
 const params=new URLSearchParams(location.search);
 document.addEventListener('keydown',event=>{const card=event.target.closest?.('.candidate-card');if(card&&(event.key==='Enter'||event.key===' ')){event.preventDefault();card.click();}});
 const observer=new MutationObserver(()=>{document.querySelectorAll('.candidate-card').forEach(e=>{e.setAttribute('role','checkbox');e.tabIndex=0;e.setAttribute('aria-checked',String(e.classList.contains('candidate-selected')));});});for(const id of ['bch-candidates-grid','bithu-candidates-grid'])observer.observe(document.getElementById(id),{childList:true});
 try{
  await configureElectionApi();
  const startup=await Promise.allSettled([refreshElection(),loadDelegateDirectory(),refreshCloudDocuments(false,true)]);
  for(const result of startup)if(result.status==='rejected')renderElectionStatus(result.reason.message);
  setDocViewerMode('iframe');
  if(state.sessionConfirmed&&(election.role!=='delegate'||params.get('gate')!=='checkin')){document.getElementById('modal-qr-login').classList.add('hidden');document.getElementById('modal-qr-login').classList.remove('flex');switchMainSection(election.role==='admin'?'admin':election.role==='bch'?'excel':'overview');}
 }catch(e){renderElectionStatus(e.message);}finally{scheduleElectionPoll();}
});
async function configureElectionApi(){
 try{const response=await fetch(new URL('./docs-config.json',document.baseURI),{cache:'no-store',signal:AbortSignal.timeout(4000)});if(response.ok){const data=await response.json();if(data.apiBase)docsCloud.apiBase=validatedDocsBase(data.apiBase);}}catch{}
 document.getElementById('docs-sync-api').value=docsCloud.apiBase;election.configured=true;
}
function scheduleElectionPoll(){
 clearTimeout(election.pollTimer);const base=election.pollFailures?Math.min(120000,30000*2**Math.min(2,election.pollFailures)):((election.role==='admin'||election.role==='bch')&&state.mainSection==='excel'?10000:30000);
 election.pollTimer=setTimeout(async()=>{try{if(!document.hidden&&navigator.onLine&&election.token&&!election.busy)await refreshElection();}catch(e){election.pollFailures++;renderElectionStatus(e.message);}finally{scheduleElectionPoll();}},base*(1+Math.random()*.2));
}
function refreshOnReturn(){if(election.token&&!document.hidden&&navigator.onLine&&!election.busy&&Date.now()-election.lastPoll>3000)refreshElection().catch(e=>renderElectionStatus(e.message));}
window.addEventListener('online',refreshOnReturn);window.addEventListener('focus',refreshOnReturn);document.addEventListener('visibilitychange',refreshOnReturn);

const vendorLoads={};
function ensureVendor(name){if(!vendorLoads[name])vendorLoads[name]=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('assets/'+(name==='xlsx'?'xlsx.full.min.js':'chart.umd.min.js'),document.baseURI);script.onload=resolve;script.onerror=()=>{delete vendorLoads[name];reject(new Error('Không tải được thư viện '+name+'. Thử lại sau.'));};document.head.append(script);});return vendorLoads[name];}
const originalExportXlsx=exportElectionToExcel;
window.exportElectionToExcel=()=>runElection(async()=>{await ensureVendor('xlsx');await refreshElection();originalExportXlsx();});
const originalExportCsv=exportElectionToCSV;
window.exportElectionToCSV=()=>runElection(async()=>{await refreshElection();originalExportCsv();});
async function testAllCloudConnections(){return runElection(async()=>{const docs=await docsRequest('/health');const health=await electionRequest('health','GET',undefined,false);await refreshElection();const el=document.getElementById('cloud-ping-status-box');el.textContent='Văn kiện: '+docs.count+' • Điểm danh/bầu cử: '+(health.ok?'D1 đã kết nối':'chưa kết nối')+' • Google Drive: cần mở thử từng PDF để xác nhận quyền chia sẻ.';el.classList.remove('hidden');});}
const originalRenderExcel=renderExcelSection;
window.renderExcelSection=function(){originalRenderExcel();if(typeof Chart==='undefined'&&['admin','bch'].includes(election.role))ensureVendor('chart').then(()=>renderAdminChart(computeElectionTally().rankedBch)).catch(e=>renderElectionStatus(e.message));};
const baseRenderElectionStatus=renderElectionStatus;
window.renderElectionStatus=function(message){baseRenderElectionStatus(message);document.querySelectorAll('[data-bch-total]').forEach(e=>e.textContent=state.candidatesBch.length);const button=document.getElementById('btn-filter-all-cand');if(button)button.textContent='Tất cả ('+state.candidatesBch.length+')';const select=document.getElementById('admin-bch-quota');if(select){select.disabled=true;select.title='Chỉnh chỉ tiêu tại Điều hành máy chủ trước khi mở vòng';}const time=document.getElementById('gate-checkin-time-label');if(time&&getCurrentVoter().checkedInAt)time.textContent='Điểm danh: '+formatVietnamCheckinTime(getCurrentVoter().checkedInAt);};
function csvCell(value){let text=String(value??'');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return text.replace(/"/g,'""');}
const renderVersionStatus=renderElectionStatus;
window.renderElectionStatus=function(message){renderVersionStatus(message);const status=document.getElementById('election-status');if(status&&!status.textContent.startsWith('HTB 2.1'))status.textContent='HTB 2.1 • '+status.textContent;if(status)status.hidden=!message&&!['admin','bch'].includes(election.role);onQrDelegateSelectionChange();};

async function saveGateQrSettings(){return runElection(async()=>{const gateQrUrl=normalizeGateQrUrl(document.getElementById('admin-qr-link-input').value);const gateQrLabel=document.getElementById('admin-qr-label-input').value.trim().toUpperCase();await electionRequest('presentation','PUT',{gateQrUrl,gateQrLabel});await refreshElection();showToast('Đã lưu cổng QR trên máy chủ cho tất cả thiết bị.','success');});}
