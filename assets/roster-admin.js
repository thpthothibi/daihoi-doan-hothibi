/* Load after election.js and reset-admin.js. Admin-only roster deletion. */
(() => {
 'use strict';
 let backup=null,busy=false,focus;
 const modal=document.createElement('div');modal.hidden=true;
 modal.style.cssText='position:fixed;inset:0;z-index:10001;padding:16px;background:#0f172acc;overflow:auto;align-items:center;justify-content:center';
 modal.innerHTML=`<form role="dialog" aria-modal="true" aria-labelledby="roster-delete-title" style="background:white;color:#0f172a;width:100%;max-width:560px;padding:24px;border-radius:16px;box-sizing:border-box;margin:auto">
 <h2 id="roster-delete-title" style="font-size:20px;font-weight:800;margin:0 0 12px">Xóa toàn bộ danh sách đại biểu</h2>
 <p style="background:#fff1f2;padding:12px;border-radius:10px">Xóa tất cả đại biểu đã import, mã kích hoạt, điểm danh và phiên đăng nhập đại biểu. Bạn có thể import lại danh sách mới sau đó.</p>
 <p>Giữ tài khoản admin/BCH, ứng viên, quy chế, chương trình và văn kiện. Nếu còn phiếu bầu, hệ thống sẽ chặn thao tác này.</p>
 <button type="button" id="roster-backup" style="padding:10px;border:1px solid #0284c7;border-radius:8px;color:#075985;background:#f0f9ff;font-weight:700">1. Tải bản sao lưu danh sách</button>
 <label style="display:block;margin:12px 0"><input type="checkbox" id="roster-saved" required> Tôi đã lưu và kiểm tra bản sao lưu.</label>
 <label for="roster-password" style="font-weight:700">Mật khẩu quản trị</label>
 <input id="roster-password" type="password" autocomplete="current-password" required maxlength="128" style="display:block;width:100%;box-sizing:border-box;border:1px solid #94a3b8;padding:10px;border-radius:8px;margin:6px 0 12px">
 <label for="roster-confirm" style="font-weight:700">Nhập chính xác: XOA TOAN BO DAI BIEU</label>
 <input id="roster-confirm" type="text" autocomplete="off" required style="display:block;width:100%;box-sizing:border-box;border:1px solid #94a3b8;padding:10px;border-radius:8px;margin:6px 0 12px">
 <p id="roster-message" role="status" style="color:#be123c;white-space:pre-wrap"></p>
 <div style="display:flex;gap:10px;flex-wrap:wrap"><button id="roster-submit" type="submit" disabled style="background:#be123c;color:white;border:0;border-radius:9px;padding:11px 16px;font-weight:700">2. Xóa toàn bộ đại biểu</button><button id="roster-cancel" type="button" style="background:#e2e8f0;border:0;border-radius:9px;padding:11px 16px">Hủy</button></div>
 </form>`;
 document.body.append(modal);
 const el=id=>modal.querySelector('#'+id),message=text=>{el('roster-message').textContent=text;};
 function update(){el('roster-submit').disabled=busy||!backup||!el('roster-saved').checked||!el('roster-password').value||el('roster-confirm').value!=='XOA TOAN BO DAI BIEU';el('roster-cancel').disabled=busy;el('roster-backup').disabled=busy;}
 function close(){if(busy)return;modal.hidden=true;modal.style.display='none';modal.querySelector('form').reset();backup=null;focus?.focus();}
 function open(){if(election.role!=='admin'||busy)return;focus=document.activeElement;backup=null;modal.querySelector('form').reset();message('Đóng hai vòng và xóa phiếu thử trước nếu đã có người bầu.');update();modal.hidden=false;modal.style.display='flex';el('roster-backup').focus();}
 el('roster-cancel').onclick=close;modal.addEventListener('input',update);
 modal.onkeydown=event=>{if(event.key==='Escape')close();if(event.key==='Tab'){const inputs=[...modal.querySelectorAll('input,button')].filter(x=>!x.disabled);const first=inputs[0],last=inputs.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}};
 el('roster-backup').onclick=async()=>{
  if(busy)return;busy=true;backup=null;el('roster-saved').checked=false;update();message('Đang kiểm tra dữ liệu và tạo bản sao lưu…');
  try{const data=await electionRequest('roster/delete-preview');downloadJson('SAO_LUU_DAI_BIEU_'+Date.now()+'.json',data);backup=data;message('Đã yêu cầu tải bản sao lưu '+data.delegates.length+' đại biểu. Kiểm tra tệp tải xuống trước khi xác nhận.');}
  catch(e){message(e.status===404?'Worker chưa cập nhật chức năng xóa đại biểu. Cập nhật Worker trong gói mới.':e.message);}
  finally{busy=false;update();}
 };
 modal.querySelector('form').onsubmit=async event=>{
  event.preventDefault();update();if(el('roster-submit').disabled||election.role!=='admin')return;
  const password=el('roster-password').value;el('roster-password').value='';busy=true;update();message('Đang xóa danh sách trên máy chủ…');
  try{
   const result=await electionRequest('roster/delete-all','POST',{password,confirm:'XOA TOAN BO DAI BIEU',revision:backup.revision});
   election.directory=[];election.directoryRevision='';election.results=null;election.viewSignature='';election.resultSignature='';
   busy=false;close();showToast('Đã xóa '+result.deleted+' đại biểu. Có thể import danh sách mới.','success');
   try{await Promise.all([loadDelegateDirectory(true),refreshElection()]);}catch{showToast('Máy chủ đã xóa danh sách. Tải lại trang để cập nhật trạng thái.','warning');}
  }catch(e){backup=null;message(e.message+' Nếu mạng gián đoạn, tải lại trạng thái trước khi thử tiếp.');}
  finally{busy=false;update();}
 };
 function mount(){let button=document.getElementById('admin-delete-all-delegates');
  if(!button){const anchor=document.querySelector('[onclick="importDelegatesFromExcelFile()"]');if(!anchor)return;
   button=document.createElement('button');button.id='admin-delete-all-delegates';button.type='button';button.textContent='Xóa toàn bộ danh sách đại biểu';button.style.cssText='padding:10px 14px;border:1px solid #e11d48;border-radius:9px;background:#fff1f2;color:#9f1239;font-size:12px;font-weight:700';button.onclick=open;anchor.parentElement.append(button);
  }button.hidden=election.role!=='admin';
 }
 const previous=renderRolePermissions;renderRolePermissions=function(...args){const result=previous.apply(this,args);mount();return result;};mount();
})();
