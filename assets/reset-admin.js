/* Add after election.js. Compatible with the existing 3.0.2 admin editor. */
(() => {
 'use strict';
 let backup=null,working=false;
 const overlay=document.createElement('div');
 overlay.hidden=true;
 overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:#0f172acc;padding:16px;overflow:auto;align-items:center;justify-content:center';
 overlay.innerHTML=`<form role="dialog" aria-modal="true" aria-labelledby="reset-title" style="background:white;border-radius:16px;padding:24px;width:100%;max-width:560px;margin:auto;color:#0f172a;box-sizing:border-box">
 <h2 id="reset-title" style="font-size:20px;font-weight:800;margin:0 0 12px">Chuẩn bị đợt chính thức</h2>
 <p id="reset-summary" style="margin:0 0 12px"></p>
 <p style="background:#fff1f2;padding:12px;border-radius:10px">Xóa vĩnh viễn phiếu, trạng thái đã bầu, kết quả, khóa sổ và công bố của vòng này. Giữ danh sách ứng viên, quy chế, đại biểu và điểm danh. Vòng vẫn đóng sau khi xóa.</p>
 <button type="button" id="reset-backup" style="padding:10px;border:1px solid #0284c7;border-radius:8px;background:#f0f9ff;color:#075985;font-weight:700">1. Tải bản sao lưu trước khi xóa</button>
 <label style="display:block;margin:12px 0"><input id="reset-saved" type="checkbox" required> Tôi đã lưu và kiểm tra tệp sao lưu.</label>
 <label for="reset-password" style="display:block;font-weight:700">Mật khẩu quản trị</label>
 <input id="reset-password" type="password" autocomplete="current-password" required maxlength="128" style="display:block;width:100%;box-sizing:border-box;border:1px solid #94a3b8;padding:10px;border-radius:8px;margin:6px 0 12px">
 <label for="reset-confirm" id="reset-confirm-label" style="display:block;font-weight:700"></label>
 <input id="reset-confirm" type="text" autocomplete="off" required style="display:block;width:100%;box-sizing:border-box;border:1px solid #94a3b8;padding:10px;border-radius:8px;margin:6px 0 12px">
 <p id="reset-message" role="status" style="color:#be123c;white-space:pre-wrap"></p>
 <div style="display:flex;gap:10px;flex-wrap:wrap"><button type="submit" id="reset-submit" disabled style="padding:11px 16px;background:#be123c;color:white;border:0;border-radius:9px;font-weight:700">2. Xóa phiếu thử của vòng này</button><button type="button" id="reset-cancel" style="padding:11px 16px;background:#e2e8f0;border:0;border-radius:9px">Hủy</button></div>
 </form>`;
 document.body.append(overlay);
 const el=id=>overlay.querySelector('#'+id);
 let roundName='',previousFocus;
 const message=text=>{el('reset-message').textContent=text;};
 function close(){if(working)return;overlay.hidden=true;overlay.style.display='none';overlay.querySelector('form').reset();backup=null;previousFocus?.focus();}
 function enabled(){el('reset-submit').disabled=working||!backup||!el('reset-saved').checked||el('reset-confirm').value!==phrase()||!el('reset-password').value;}
 const phrase=()=> 'XOA PHIEU THU '+roundName.toUpperCase();
 function open(name){
  if(election.role!=='admin'||working)return;
  const round=election.rounds.find(r=>r.name===name);
  if(!round||round.status!=='closed'){showToast('Bấm Đóng vòng trước khi xóa phiếu thử.','warning');return;}
  roundName=name;backup=null;previousFocus=document.activeElement;overlay.querySelector('form').reset();
  el('reset-title').textContent='Chuẩn bị đợt chính thức — '+(name==='bch'?'Ban Chấp hành':'Bí thư');
  el('reset-summary').textContent='Chỉ đặt lại vòng '+(name==='bch'?'BCH':'Bí thư')+'. Vòng còn lại được giữ nguyên.';
  el('reset-confirm-label').textContent='Nhập chính xác: '+phrase();message('');enabled();overlay.hidden=false;overlay.style.display='flex';el('reset-backup').focus();
 }
 el('reset-cancel').onclick=close;
 overlay.onkeydown=event=>{if(event.key==='Escape')close();if(event.key==='Tab'){const inputs=[...overlay.querySelectorAll('button,input')].filter(x=>!x.disabled);const first=inputs[0],last=inputs.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}};
 overlay.addEventListener('input',enabled);
 el('reset-backup').onclick=async()=>{
  if(working)return;working=true;backup=null;enabled();message('Đang tải bản sao lưu…');
  try{const data=await electionRequest('rounds/'+roundName+'/reset-backup');
   downloadJson('SAO_LUU_PHIEU_THU_'+roundName.toUpperCase()+'_'+Date.now()+'.json',data);backup=data;
   message('Đã yêu cầu tải tệp sao lưu '+data.tables.claims.length+' phiếu. Kiểm tra tệp tải xuống rồi đánh dấu xác nhận.');
  }catch(e){message(e.status===404?'Worker chưa có chức năng đặt lại. Cập nhật Worker theo hướng dẫn trong gói.':e.message);}
  finally{working=false;enabled();}
 };
 overlay.querySelector('form').onsubmit=async event=>{
  event.preventDefault();enabled();if(el('reset-submit').disabled||election.role!=='admin')return;
  working=true;enabled();el('reset-cancel').disabled=true;message('Đang đặt lại vòng trên máy chủ…');
  const password=el('reset-password').value;el('reset-password').value='';
  try{
   await electionRequest('rounds/'+roundName+'/reset','POST',{version:backup.round.version,confirm:phrase(),password});
   // Clear cached reports before asking the server for the fresh state.
   election.results=null;election.viewSignature='';election.resultSignature='';
   working=false;close();
   showToast('Đã xóa phiếu thử. Vòng đang đóng; rà soát danh sách và quy chế trước khi Mở vòng.','success');
   try{await refreshElection();loadRoundEditor(roundName);}catch{showToast('Máy chủ đã xóa phiếu. Tải lại trang để cập nhật trạng thái.','warning');}
  }catch(e){backup=null;message(e.message+' Nếu kết nối bị gián đoạn, tải lại trạng thái và sao lưu lại trước khi thử tiếp.');}
  finally{working=false;el('reset-cancel').disabled=false;enabled();}
 };
 function mount(){
  for(const name of ['bch','bithu']){
   let button=document.getElementById('reset-test-votes-'+name);
   if(!button){const anchor=document.querySelector('[onclick="setRoundStatus(\''+name+'\',\'closed\')"]');if(!anchor)continue;
    button=document.createElement('button');button.id='reset-test-votes-'+name;button.type='button';button.textContent='Xóa phiếu thử / Chuẩn bị đợt chính thức';button.style.cssText='padding:10px 14px;border:1px solid #e11d48;border-radius:9px;background:#fff1f2;color:#9f1239;font-size:12px;font-weight:700';button.onclick=()=>open(name);anchor.parentElement.append(button);
   }
   button.hidden=election.role!=='admin';
   let archive=document.getElementById('download-secret-ballots-'+name);
   if(!archive){archive=document.createElement('button');archive.id='download-secret-ballots-'+name;archive.type='button';archive.textContent='Tải hồ sơ phiếu kín';archive.style.cssText='padding:10px 14px;border:1px solid #0284c7;border-radius:9px;background:#eff6ff;color:#075985;font-size:12px;font-weight:700';archive.onclick=async()=>{archive.disabled=true;try{const data=await electionRequest('rounds/'+name+'/secret-ballots');downloadJson('HO_SO_PHIEU_KIN_'+name.toUpperCase()+'_'+Date.now()+'.json',data);showToast('Đã yêu cầu tải '+data.storedBallots+' phiếu mã hóa. Hồ sơ có thể gồm phiếu trước khi đặt lại vòng.','success');}catch(e){showToast(e.message,'warning');}finally{archive.disabled=false;}};button.parentElement.append(archive);}
   archive.hidden=!['admin','bch'].includes(election.role);

  }
 }
 const originalPermissions=renderRolePermissions;
 renderRolePermissions=function(...args){const result=originalPermissions.apply(this,args);mount();return result;};
 mount();
})();
