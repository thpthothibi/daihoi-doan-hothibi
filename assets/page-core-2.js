// Shared Appwrite catalogue. Election authority is supplied by assets/election.js.
const docsCloud = { apiBase: 'https://htb-van-kien-api.thpthothibi2.workers.dev', token: '', loaded: false, busy: false, reading: null, lastSync: 0, status: 'Chưa cấu hình đồng bộ', pending: [], wasCloudCache: false, error: '' };
const DOCS_PENDING_KEY = 'htb_pending_documents_v1';
function escapeDocText(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function validatedDocsBase(value) {
  const url = new URL(String(value).trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Nhập địa chỉ gốc HTTPS của Worker, không kèm /api hay đường dẫn.');
  return url.origin;
}
function updateDocsSyncStatus(message, failed = false) {
  docsCloud.status = message; docsCloud.error = failed ? message : '';
  for (const id of ['docs-sync-status', 'sys-doc-sync-state']) {
    const el = document.getElementById(id); if (el) { el.textContent = message; el.style.color = failed ? '#be123c' : '#0369a1'; }
  }
  const badge = document.getElementById('sys-overall-state'); if (badge) badge.textContent = docsCloud.loaded && !failed ? '● Văn kiện đã kết nối' : '● ' + message;
  const db = document.getElementById('sys-db-state'); if (db) db.textContent = docsCloud.loaded && !failed ? 'Văn kiện: đã kết nối' : 'Văn kiện: chưa xác nhận';
}
async function docsRequest(path, options = {}, apiBase = docsCloud.apiBase) {
  if (!apiBase) throw new Error('Chưa cấu hình địa chỉ Worker đồng bộ văn kiện.');
  const headers = new Headers(options.headers || {});
  if (options.body) headers.set('Content-Type', 'application/json');
  if (options.admin) {
    if (!docsCloud.token) throw new Error('Nhập khóa quản trị đồng bộ rồi bấm Kết nối.');
    headers.set('Authorization', 'Bearer ' + docsCloud.token);
  }
  let response;
  try { response = await fetch(apiBase + '/api' + path, { method: options.method || 'GET', headers, body: options.body ? JSON.stringify(options.body) : undefined, signal: AbortSignal.timeout(20000), cache: 'no-store', credentials: 'omit', redirect: 'error' }); }
  catch (_) { throw new Error('Không gọi được Worker. Kiểm tra địa chỉ API, mạng và ALLOWED_ORIGINS.'); }
  let data; try { data = await response.json(); } catch (_) { throw new Error('API không trả JSON. Kiểm tra đã triển khai đúng worker.mjs.'); }
  if (!response.ok) { if (response.status === 401) docsCloud.token = ''; throw new Error(data.error || 'Không đồng bộ được văn kiện.'); }
  return data;
}
function asCloudDocument(doc) {
  if (!doc || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(doc.id) || !/^[\w-]{10,200}$/.test(doc.driveFileId) || !['BAO_CAO', 'NHAN_SU', 'QUY_CHE', 'NOI_QUY'].includes(doc.category) || typeof doc.title !== 'string') throw new Error('Dữ liệu văn kiện máy chủ không hợp lệ.');
  return { id: doc.id, title: doc.title, category: doc.category, driveFileId: doc.driveFileId, size: doc.size || '', summary: String(doc.summary || ''), driveUrl: 'https://drive.google.com/file/d/' + doc.driveFileId + '/preview', updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toLocaleString('vi-VN') : '', cloudSynced: true,
    summaryHtml: '<div class="space-y-2"><p class="font-bold text-slate-900">' + escapeDocText(doc.title) + '</p><p style="white-space:pre-wrap">' + escapeDocText(doc.summary || '') + '</p></div>' };
}
function rerenderSyncedDocuments() {
  renderDocumentsList(); renderActiveDocumentViewer(); renderAdminDriveAndQrSection(); renderVoterBar(); if (typeof renderElectionStatus === "function") renderElectionStatus();
  const folder = document.getElementById('admin-drive-folder-id'); if (folder && document.activeElement !== folder) { folder.value = state.config.driveFolderId || ''; syncDriveFolderLinkFromId(); }
}
async function refreshCloudDocuments(announce = false, fresh = false) {
  if (!docsCloud.apiBase) { if (announce) showToast('Chưa cấu hình API đồng bộ văn kiện.', 'warning'); return; }
  if (docsCloud.reading) return docsCloud.reading;
  docsCloud.reading = (async () => {
    try {
      const data = await docsRequest('/documents' + (fresh ? '?fresh=1' : ''));
      if (!Array.isArray(data.documents)) throw new Error('API không trả danh sách văn kiện.');
      const documents = data.documents.map(asCloudDocument);
      state.documents = documents;
      if (!documents.some(d => d.id === state.activeDocumentId)) state.activeDocumentId = documents[0]?.id || null;
      state.config.driveFolderId = data.settings?.driveFolderId || '';
      state.config.driveLoadMode = data.settings?.driveLoadMode || 'PREVIEW';
      docsCloud.loaded = true; docsCloud.lastSync = Date.now(); saveState(); rerenderSyncedDocuments();
      updateDocsSyncStatus('Đã đồng bộ ' + documents.length + ' văn kiện');
      document.getElementById('sys-drive-time').textContent = 'Cập nhật: ' + new Date().toLocaleTimeString('vi-VN');
      if (announce) showToast('Đã tải danh sách văn kiện chung từ Appwrite.', 'success');
    } catch (e) { updateDocsSyncStatus(e.message, true); if (announce) showToast(e.message, 'error'); throw e; }
    finally { docsCloud.reading = null; }
  })();
  return docsCloud.reading;
}
async function connectDocsCloud() {
  const input = document.getElementById('docs-sync-api'); const secret = document.getElementById('docs-sync-key');
  try {
    const base = validatedDocsBase(input.value);
    const candidate = secret.value.trim();
    if (candidate) docsCloud.token = candidate;
    // Never send an old token to a newly entered endpoint.
    if (base !== docsCloud.apiBase && !candidate) docsCloud.token = '';
    if (!docsCloud.token) throw new Error('Nhập khóa quản trị đồng bộ đã đặt trong Worker.');
    await docsRequest('/admin/verify', { method: 'POST', admin: true }, base);
    docsCloud.apiBase = base; state.config.documentsApiBase = base; saveState(); secret.value = '';
    await refreshCloudDocuments(true, true);
    showToast('Kết nối thành công. Tải docs-config.json và đưa lên GitHub để các máy khác tự kết nối.', 'success');
  } catch (e) { updateDocsSyncStatus(e.message, true); showToast(e.message, 'error'); }
}
function downloadDocsPublicConfig() {
  try {
    const base = validatedDocsBase(document.getElementById('docs-sync-api').value || docsCloud.apiBase);
    const blob = new Blob([JSON.stringify({ apiBase: base }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'), url = URL.createObjectURL(blob); a.href = url; a.download = 'docs-config.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Đưa docs-config.json lên GitHub cùng thư mục index.html. File này không chứa khóa quản trị.', 'info');
  } catch (e) { showToast(e.message, 'error'); }
}
function requireDocsAdmin() {
  if (state.userRole !== 'admin' || !docsCloud.apiBase || !docsCloud.token) throw new Error('Cần đăng nhập Admin và kết nối bằng khóa quản trị đồng bộ trước khi lưu.');
}
function parseDriveFile(input) {
  const raw = String(input || '').trim();
  if (/^[\w-]{10,200}$/.test(raw)) return raw;
  try { const u = new URL(raw); if (u.hostname !== 'drive.google.com' || u.protocol !== 'https:') throw new Error(); const id = u.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] || u.searchParams.get('id'); if (!/^[\w-]{10,200}$/.test(id || '')) throw new Error(); return id; }
  catch (_) { throw new Error('Dán liên kết file PDF Google Drive (không dùng liên kết thư mục).'); }
}
async function addGoogleDriveDocument() {
  if (docsCloud.busy) return;
  try {
    requireDocsAdmin();
    const data = { title: document.getElementById('new-doc-title').value.trim(), category: document.getElementById('new-doc-category').value, size: document.getElementById('new-doc-size').value.trim(), driveFileId: parseDriveFile(document.getElementById('new-doc-drive-url').value), summary: document.getElementById('new-doc-summary').value.trim() };
    if (!data.title) throw new Error('Nhập tên văn kiện.');
    docsCloud.busy = true;
    const id = 'doc-' + crypto.randomUUID().replaceAll('-', '').slice(0, 28);
    await docsRequest('/documents/' + id, { method: 'PUT', body: data, admin: true });
    state.activeDocumentId = id; closeDriveConfigModal();
    showToast('Đã lưu văn kiện lên máy chủ.', 'success');
    try { await refreshCloudDocuments(false, true); } catch (_) { showToast('Đã lưu nhưng chưa tải lại được danh sách. Bấm Đồng bộ ngay để tải lại.', 'warning'); }
  } catch (e) { showToast(e.message, 'error'); } finally { docsCloud.busy = false; }
}
async function deleteDriveDocument(id) {
  if (docsCloud.busy) return;
  try {
    requireDocsAdmin();
    if (!confirm('Xóa văn kiện khỏi danh sách chung cho tất cả các máy? File PDF trên Drive vẫn được giữ.')) return;
    docsCloud.busy = true; await docsRequest('/documents/' + encodeURIComponent(id), { method: 'DELETE', admin: true });
    showToast('Đã xóa khỏi danh sách chung.', 'success');
    try { await refreshCloudDocuments(false, true); } catch (_) { showToast('Đã xóa trên máy chủ. Bấm Đồng bộ ngay để tải lại danh sách.', 'warning'); }
  } catch (e) { showToast(e.message, 'error'); } finally { docsCloud.busy = false; }
}
async function saveAdminDriveSettings() {
  try {
    requireDocsAdmin(); const data = { driveFolderId: document.getElementById('admin-drive-folder-id').value.trim(), driveLoadMode: state.config.driveLoadMode };
    await docsRequest('/settings', { method: 'PUT', body: data, admin: true });
    await refreshCloudDocuments(false, true); showToast('Đã lưu cấu hình Drive dùng chung.', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}
async function syncGoogleDriveDocsNow() { try { await refreshCloudDocuments(true, true); } catch (_) {} }
async function testGoogleDriveConnection() {
  // Cross-origin Google Drive permissions cannot be verified reliably from this page.
  const id = document.getElementById('admin-drive-folder-id').value.trim();
  if (!/^[\w-]{10,200}$/.test(id)) { showToast('Nhập mã thư mục Drive hợp lệ.', 'warning'); return; }
  window.open('https://drive.google.com/drive/folders/' + id, '_blank', 'noopener,noreferrer');
  showToast('Đã mở thư mục Drive. Kiểm tra quyền xem bằng cửa sổ ẩn danh; website không tự xác minh quyền Google Drive.', 'info');
}
async function testAllCloudConnections() {
  const box = document.getElementById('cloud-ping-status-box');
  try {
    const result = await docsRequest('/health');
    if (!result.ok || result.service !== 'htb-documents-sync') throw new Error('API chưa xác nhận kết nối.');
    if (box) { box.classList.remove('hidden'); box.textContent = 'Đã gọi Worker và đọc Appwrite thành công: ' + result.count + ' văn kiện. Chưa kiểm tra quyền PDF Google Drive. Điểm danh và bầu cử vẫn lưu trên thiết bị.'; }
    showToast('Worker và Appwrite đã phản hồi thật.', 'success');
  } catch (e) { if (box) { box.classList.remove('hidden'); box.textContent = e.message; } showToast(e.message, 'error'); }
}
async function publishPreviousDocuments() {
  if (docsCloud.busy) return;
  let published = 0;
  try {
    requireDocsAdmin();
    const list = docsCloud.pending;
    if (!list.length) throw new Error('Máy này không có danh sách cũ cần chuyển. Mở bằng đúng trình duyệt đã thêm văn kiện trước đây.');
    if (!confirm('Chuyển ' + list.length + ' văn kiện từ trình duyệt này lên danh sách chung? Các văn kiện đã có cùng mã sẽ được cập nhật.')) return;
    docsCloud.busy = true;
    const remaining = [...list];
    while (remaining.length) {
      const doc = remaining[0];
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(doc.id)) throw new Error('Mã văn kiện cũ không hợp lệ. Hãy thêm lại tài liệu này bằng liên kết Drive.');
      const summary = typeof doc.summary === 'string' ? doc.summary : (() => { const t = document.createElement('div'); t.innerHTML = doc.summaryHtml || ''; return t.textContent || ''; })();
      await docsRequest('/documents/' + doc.id, { method: 'PUT', admin: true, body: { title: doc.title, category: doc.category, driveFileId: parseDriveFile(doc.driveFileId), size: doc.size || '', summary } });
      remaining.shift(); published++; docsCloud.pending = [...remaining]; localStorage.setItem(DOCS_PENDING_KEY, JSON.stringify(remaining));
    }
    await refreshCloudDocuments(false, true); showToast('Đã chuyển ' + published + ' văn kiện lên danh sách chung.', 'success');
  } catch (e) { showToast((published ? 'Đã chuyển ' + published + ' tài liệu. ' : '') + e.message, 'error'); }
  finally { docsCloud.busy = false; }
}
function capturePreviousDocuments() {
  try {
    const saved = JSON.parse(localStorage.getItem('htb_election_state_v2') || 'null');
    docsCloud.wasCloudCache = saved?.documentsSource === 'cloud';
    const previous = JSON.parse(localStorage.getItem(DOCS_PENDING_KEY) || 'null');
    if (Array.isArray(previous)) docsCloud.pending = previous;
    else if (saved && !docsCloud.wasCloudCache && Array.isArray(saved.documents)) {
      docsCloud.pending = saved.documents.filter(d => !INITIAL_DRIVE_DOCUMENTS.some(sample => sample.id === d.id));
      localStorage.setItem(DOCS_PENDING_KEY, JSON.stringify(docsCloud.pending));
    }
  } catch (_) { /* Keep the existing catalogue if local storage is unavailable. */ }
}
async function initDocumentsSync() {
  try {
    if (state.config.documentsApiBase) docsCloud.apiBase = validatedDocsBase(state.config.documentsApiBase);
    if (/^https?:$/.test(location.protocol)) {
      try {
        const r = await fetch(new URL('./docs-config.json', document.baseURI), { cache: 'no-store', signal: AbortSignal.timeout(8000) });
        if (r.ok) { const data = await r.json(); if (data.apiBase) docsCloud.apiBase = validatedDocsBase(data.apiBase); }
      } catch (_) { /* A missing config does not falsely indicate a connection. */ }
    }
    document.getElementById('docs-sync-api').value = docsCloud.apiBase;
    if (docsCloud.apiBase) await refreshCloudDocuments(false, true);
    else updateDocsSyncStatus('Chưa cấu hình đồng bộ — dữ liệu trên máy này');
  } catch (e) { updateDocsSyncStatus(e.message, true); }
}

setInterval(() => { if (!document.hidden && navigator.onLine && docsCloud.apiBase && !docsCloud.busy) refreshCloudDocuments(false).catch(() => {}); }, 90000 + Math.random() * 15000);
window.addEventListener('focus', () => { if (docsCloud.apiBase && Date.now() - docsCloud.lastSync > 15000) refreshCloudDocuments(false).catch(() => {}); });