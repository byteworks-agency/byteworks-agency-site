// Admin layout client script (bundled by Vite)
const COMPANY_CODE = 'BW';

function genRef() {
  const dt = new Date();
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const prefix = `${COMPANY_CODE}-${y}${m}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
}

async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
  location.replace('/auth/signin');
}

function setupCollapse() {
  const key = 'bwAdminSidebarCollapsed';
  const aside = document.getElementById('adminSidebar');
  const icon = document.getElementById('sidebarToggleIcon');
  function setIcon() {
    if (!icon || !aside) return;
    icon.textContent = aside.classList.contains('collapsed') ? 'chevron_right' : 'chevron_left';
  }
  function setCollapsed(v) {
    if (!aside) return;
    aside.classList.toggle('collapsed', v);
    try { localStorage.setItem(key, v ? '1' : '0'); } catch {}
    setIcon();
  }
  const stored = (typeof localStorage !== 'undefined') ? localStorage.getItem(key) : null;
  if (stored === '1') setCollapsed(true); else setIcon();
  window.toggleSidebar = function () { setCollapsed(!(aside && aside.classList.contains('collapsed'))); };
  const btn = document.getElementById('sidebarToggleBtn');
  if (btn) btn.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); window.toggleSidebar(); });
}

function setupMobileSidebar() {
  const aside = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  function open() {
    if (!aside) return;
    if (window.innerWidth < 768) aside.classList.remove('collapsed');
    aside.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const hb = document.getElementById('hamburgerBtn');
    if (hb) hb.setAttribute('aria-expanded', 'true');
  }
  function close() {
    if (aside) aside.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    const hb = document.getElementById('hamburgerBtn');
    if (hb) hb.setAttribute('aria-expanded', 'false');
  }
  function toggle() { if (!aside) return; if (aside.classList.contains('-translate-x-full')) open(); else close(); }
  window.openSidebarMobile = open;
  window.closeSidebarMobile = close;
  window.toggleSidebarMobile = toggle;
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) close(); });
  const hb = document.getElementById('hamburgerBtn');
  if (hb) hb.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
  const nq = document.getElementById('newQuoteLink');
  if (nq) nq.addEventListener('click', (e) => { e.preventDefault(); try { window.nwq_open && window.nwq_open(); } catch { } close(); });
}

function nwq_open(prefill) {
  // Close mobile sidebar if open so modal is fully visible
  if (window.innerWidth < 768 && window.closeSidebarMobile) try { window.closeSidebarMobile(); } catch {}
  const m = document.getElementById('nwq_modal');
  if (m) m.classList.remove('hidden');
  if (m) m.classList.add('flex');
  // lock background scroll
  document.body.classList.add('overflow-hidden');
  const idWrap = document.getElementById('nwq_enquiryId_wrap');
  const nameEl = document.getElementById('nwq_billToName');
  const emailEl = document.getElementById('nwq_billToEmail');
  const phoneEl = document.getElementById('nwq_billToPhone');
  const idEl = document.getElementById('nwq_enquiryId');
  const titleEl = document.getElementById('nwq_title');
  // Enable/disable archive/delete actions depending on whether this quote is tied to a lead
  const archiveBtn = document.getElementById('nwq_archiveBtn');
  const deleteBtn = document.getElementById('nwq_deleteBtn');
  if (!prefill) {
    window.nwq_activeLeadId = undefined;
    if (archiveBtn) archiveBtn.setAttribute('disabled', 'true');
    if (deleteBtn) deleteBtn.setAttribute('disabled', 'true');
    if (idWrap) idWrap.classList.remove('hidden');
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    const gen = genRef();
    if (idEl) idEl.value = gen;
    window.nwq_enquiryIdOverride = gen;
    if (titleEl) titleEl.textContent = `Quote #${gen}`;
    setTimeout(() => { if (idEl && idEl.focus) idEl.focus(); }, 0);
    return;
  }
  // Pre-filled from an existing lead: keep a reference so Archive/Delete work with DB
  try {
    const leadId = prefill && prefill.leadId ? String(prefill.leadId) : '';
    window.nwq_activeLeadId = leadId || undefined;
    if (archiveBtn) archiveBtn.toggleAttribute('disabled', !leadId);
    if (deleteBtn) deleteBtn.toggleAttribute('disabled', !leadId);
  } catch {}
  if (idWrap) idWrap.classList.add('hidden');
  if (nameEl && prefill.name) nameEl.value = prefill.name;
  if (emailEl && prefill.email) emailEl.value = prefill.email;
  if (phoneEl && prefill.phone) phoneEl.value = prefill.phone;
  const rid = prefill.enquiryId || genRef();
  window.nwq_enquiryIdOverride = rid;
  if (titleEl) titleEl.textContent = `Quote #${rid}`;
  setTimeout(() => { if (nameEl && nameEl.focus) nameEl.focus(); }, 0);
}

function nwq_close() {
  const m = document.getElementById('nwq_modal');
  if (m) m.classList.add('hidden');
  if (m) m.classList.remove('flex');
  // unlock background scroll
  document.body.classList.remove('overflow-hidden');
}

async function nwq_apiCreate(id, extras = {}) {
  const qs = id && id.trim() ? `?enquiryId=${encodeURIComponent(id.trim())}` : '';
  const res = await fetch(`/api/quotes/create${qs}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(extras)
  });
  return res.json();
}

function nwq_gatherItems() {
  const container = document.getElementById('nwq_items');
  const descs = container.querySelectorAll('input[data-nwq="desc"]');
  const qtys = container.querySelectorAll('input[data-nwq="qty"]');
  const prices = container.querySelectorAll('input[data-nwq="price"]');
  const items = [];
  for (let i = 0; i < descs.length; i++) {
    const description = (descs[i].value || '').trim();
    if (!description) continue;
    const qtyN = Number((qtys[i] && qtys[i].value) || '0');
    const priceN = Number((prices[i] && prices[i].value) || '0');
    const qty = (qtyN > 0 ? qtyN : 0).toFixed(2);
    const unitPrice = (priceN >= 0 ? priceN : 0).toFixed(2);
    items.push({ description, qty, unitPrice, sort: i + 1 });
  }
  return items;
}

async function nwq_createFrom(id) {
  const billToName = (document.getElementById('nwq_billToName')).value.trim() || undefined;
  const billToEmail = (document.getElementById('nwq_billToEmail')).value.trim() || undefined;
  const billToPhone = (document.getElementById('nwq_billToPhone')).value.trim() || undefined;
  const currency = (document.getElementById('nwq_currency')).value || undefined;
  const items = nwq_gatherItems();
  if (items.length === 0) { alert('Add at least one item with description.'); return; }
  const invalid = items.find(it => Number(it.qty) <= 0 || Number(it.unitPrice) < 0);
  if (invalid) { alert('Qty must be > 0 and price >= 0'); return; }
  const json = await nwq_apiCreate(id, { billToName, billToEmail, billToPhone, currency, items });
  if (!json || !json.ok) { alert('Error: ' + ((json && json.code) || 'unknown')); return; }
  // Mark lead as quoting and archived (front-end only) and refresh lists
  try {
    const leadId = window.nwq_activeLeadId;
    if (leadId) {
      const archivedSet = (function(){ try { return new Set(JSON.parse(localStorage.getItem('bwArchivedLeads')||'[]')); } catch { return new Set(); } })();
      archivedSet.add(leadId);
      localStorage.setItem('bwArchivedLeads', JSON.stringify(Array.from(archivedSet)));
      const quotingSet = (function(){ try { return new Set(JSON.parse(localStorage.getItem('bwQuotingLeads')||'[]')); } catch { return new Set(); } })();
      quotingSet.add(leadId);
      localStorage.setItem('bwQuotingLeads', JSON.stringify(Array.from(quotingSet)));
      // Try to persist status if backend supports it
      fetch('/api/leads/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: leadId, status: 'quoting' }) }).catch(()=>{});
      // Reflect DB intent on DOM attributes for filters/labels
      document.querySelectorAll(`[data-raw-id="${leadId}"]`).forEach((el)=>{ try { el.setAttribute('data-archived', 'true'); el.setAttribute('data-status', 'quoting'); } catch {} });
      if (window.leads_applyFilters) window.leads_applyFilters();
    }
  } catch {}
  nwq_close();
  location.href = `/admin/quotes/${json.data.quoteId}`;
}

function wireLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
  window.logout = logout;
}

// Expose modal helpers for inline attributes
window.nwq_open = nwq_open;
window.nwq_close = nwq_close;
window.nwq_addItem = function () {
  const wrap = document.getElementById('nwq_items');
  const row = document.createElement('div');
  row.className = 'nwq-item-row md:col-span-6 grid md:grid-cols-6 gap-2';
  row.innerHTML = `
    <div class="md:col-span-4">
      <label class="block text-xs mb-1">Item Description</label>
      <div class="space-y-2">
        <select data-nwq="preset" class="border px-3 py-2 rounded w-full bg-white dark:bg-background-dark dark:border-gray-700 text-gray-900 dark:text-gray-100">
          <option value="">Select an item…</option>
          <optgroup label="Plans">
            <option value="plan:Start">Start</option>
            <option value="plan:Pro">Pro</option>
            <option value="plan:Elite">Elite</option>
            <option value="plan:E-Commerce Pro">E-Commerce Pro</option>
          </optgroup>
          <optgroup label="Add-ons">
            <option value="addon:Advanced SEO & Local Positioning">Advanced SEO & Local Positioning</option>
            <option value="addon:Blog / News Section">Blog / News Section</option>
            <option value="addon:Small Online Store (up to 10 products)">Small Online Store (up to 10 products)</option>
            <option value="addon:Extended Catalog (extra product blocks)">Extended Catalog (extra product blocks)</option>
            <option value="addon:Basic Branding Package (one-time)">Basic Branding Package (one-time)</option>
          </optgroup>
          <option value="other">Other…</option>
        </select>
        <div class="nwq-desc-wrap hidden">
          <input data-nwq="desc" placeholder="Custom description" class="border px-3 py-2 rounded w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 bg-white dark:bg-background-dark dark:border-gray-700" />
        </div>
      </div>
    </div>
    <div>
      <label class="block text-xs mb-1">Qty</label>
      <input data-nwq="qty" type="number" step="0.01" value="1" class="border px-3 py-2 rounded w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-background-dark dark:border-gray-700" />
    </div>
    <div>
      <label class="block text-xs mb-1">Unit Price</label>
      <input data-nwq="price" type="number" step="0.01" value="0" class="border px-3 py-2 rounded w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-background-dark dark:border-gray-700" />
    </div>`;
  wrap.appendChild(row);
  // bind new row preset
  const select = row.querySelector('select[data-nwq="preset"]');
  const desc = row.querySelector('input[data-nwq="desc"]');
  const descWrap = row.querySelector('.nwq-desc-wrap');
  if (select && desc) {
    const apply = () => {
      const v = select.value || '';
      if (v === 'other') {
        if (descWrap) descWrap.classList.remove('hidden');
        desc.removeAttribute('readonly');
        if (!desc.value) desc.focus();
      } else if (v) {
        const label = select.options[select.selectedIndex].textContent;
        desc.value = label || '';
        desc.setAttribute('readonly', 'true');
        if (descWrap) descWrap.classList.add('hidden');
      } else {
        desc.removeAttribute('readonly');
        if (descWrap) descWrap.classList.add('hidden');
      }
    };
    select.addEventListener('change', apply);
    apply();
  }
};
window.nwq_quickCreate = function () {
  const idEl = (document.getElementById('nwq_enquiryId'));
  const id = idEl && idEl.value ? idEl.value.trim() : '';
  const finalId = id || window.nwq_enquiryIdOverride || '';
  return nwq_createFrom(finalId);
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
  wireLogout();
  setupCollapse();
  setupMobileSidebar();
  setupLeadsFilters();
  // Wire plus/minus icon buttons
  const addIcon = document.getElementById('nwq_addIconBtn');
  if (addIcon) addIcon.addEventListener('click', (e) => { e.preventDefault(); window.nwq_addItem(); });
  const removeIcon = document.getElementById('nwq_removeIconBtn');
  if (removeIcon) removeIcon.addEventListener('click', (e) => { e.preventDefault(); nwq_removeLastItem(); });
  // Wire archive/delete pretty confirm modal
  const archiveBtn = document.getElementById('nwq_archiveBtn');
  if (archiveBtn) archiveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openConfirm({
      title: 'Archive lead?',
      message: 'This will move the lead to archived.',
      variant: 'neutral',
      onConfirm: async () => {
        const id = window.nwq_activeLeadId;
        if (!id) return closeConfirm();
        let ok = false;
        try {
          const res = await fetch('/api/leads/archive', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, archived: true }) });
          const j = await res.json().catch(()=>({}));
          ok = !!(res.ok && j && j.ok);
        } catch {}
        if (!ok) { alert('Could not archive on server. Please check your admin session.'); return; }
        const arch = loadArchived();
        arch.add(id);
        try { localStorage.setItem('bwArchivedLeads', JSON.stringify(Array.from(arch))); } catch {}
        document.querySelectorAll(`[data-raw-id="${id}"]`).forEach((el)=>{ try { el.setAttribute('data-archived', 'true'); } catch {} });
        if (window.leads_applyFilters) window.leads_applyFilters();
        if (window.leads_refreshArchiveLabels) window.leads_refreshArchiveLabels();
        nwq_close();
      }
    });
  });
  const deleteBtn = document.getElementById('nwq_deleteBtn');
  if (deleteBtn) deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openConfirm({
      title: 'Delete lead?',
      message: 'This will remove the lead from the list.',
      variant: 'danger',
      onConfirm: async () => {
        const id = window.nwq_activeLeadId;
        if (!id) return closeConfirm();
        let ok = false;
        try {
          const res = await fetch('/api/leads/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
          const j = await res.json().catch(()=>({}));
          ok = !!(res.ok && j && j.ok);
        } catch {}
        if (!ok) { alert('Could not delete on server. Please check your admin session.'); return; }
        const del = loadDeleted();
        del.add(id);
        try { localStorage.setItem('bwDeletedLeads', JSON.stringify(Array.from(del))); } catch {}
        removeLeadFromDom(id);
        nwq_close();
      }
    });
  });
  // Bind initial row preset selector
  document.querySelectorAll('.nwq-item-row').forEach((row)=>{
    const select = row.querySelector('select[data-nwq="preset"]');
    const desc = row.querySelector('input[data-nwq="desc"]');
    const descWrap = row.querySelector('.nwq-desc-wrap');
    if (!select || !desc) return;
    const apply = () => {
      const v = select.value || '';
      if (v === 'other') {
        if (descWrap) descWrap.classList.remove('hidden');
        desc.removeAttribute('readonly');
      } else if (v) {
        const label = select.options[select.selectedIndex].textContent;
        desc.value = label || '';
        desc.setAttribute('readonly', 'true');
        if (descWrap) descWrap.classList.add('hidden');
      } else {
        desc.removeAttribute('readonly');
        if (descWrap) descWrap.classList.add('hidden');
      }
    };
    select.addEventListener('change', apply);
    apply();
  });
});

// realtime removed

function removeLeadFromDom(id){
  const nodes = document.querySelectorAll(`[data-raw-id="${id}"]`);
  nodes.forEach((n)=> n.remove());
  if (window.leads_applyFilters) window.leads_applyFilters();
}

function setupLeadsFilters(){
  const search = document.getElementById('search-leads');
  const toggle = document.getElementById('toggle-archived');
  const tbody = document.getElementById('leads_tbody');
  const cards = document.getElementById('leads_cards');
  if (!search || !toggle || !tbody || !cards) return; // not on dashboard
  const emptyRow = document.getElementById('leads_empty_row');
  const emptyCards = document.getElementById('leads_empty_cards');

  // Read archived mode from URL search params to match server-side filter
  const urlParams = new URLSearchParams(location.search);
  let showArchived = (urlParams.get('archived') === '1' || (urlParams.get('archived')||'').toLowerCase() === 'true');
  function loadArchived(){
    try { return new Set(JSON.parse(localStorage.getItem('bwArchivedLeads')||'[]')); } catch { return new Set(); }
  }
  function saveArchived(set){
    try { localStorage.setItem('bwArchivedLeads', JSON.stringify(Array.from(set))); } catch {}
  }
  let archived = loadArchived();
  let deleted = (function(){ try { return new Set(JSON.parse(localStorage.getItem('bwDeletedLeads')||'[]')); } catch { return new Set(); } })();
  let quoting = (function(){ try { return new Set(JSON.parse(localStorage.getItem('bwQuotingLeads')||'[]')); } catch { return new Set(); } })();

  function updateToggleLabel(){ toggle.textContent = showArchived ? 'Show active' : 'Show archived'; }

  function eachLead(cb){
    tbody.querySelectorAll('tr[data-raw-id]').forEach((row)=>{
      const id = row.getAttribute('data-raw-id');
      const name = (row.getAttribute('data-name')||'');
      const phone = (row.getAttribute('data-phone')||'');
      const did = (row.getAttribute('data-id')||'');
      cb({ type:'row', el: row, id, name, phone, did });
    });
    cards.querySelectorAll('article[data-raw-id]').forEach((card)=>{
      const id = card.getAttribute('data-raw-id');
      const name = (card.getAttribute('data-name')||'');
      const phone = (card.getAttribute('data-phone')||'');
      const did = (card.getAttribute('data-id')||'');
      cb({ type:'card', el: card, id, name, phone, did });
    });
  }

  function apply(){
    const q = (search.value||'').trim().toLowerCase();
    let anyTable=false, anyCards=false;
    eachLead((x)=>{
      const attrArch = (x.el.getAttribute('data-archived')||'').toLowerCase();
      const isArchivedDB = attrArch === 'true' || attrArch === '1';
      const isArchived = isArchivedDB || archived.has(x.id);
      const isDeleted = deleted.has(x.id);
      const matchesArchived = showArchived ? isArchived : !isArchived;
      const hay = `${x.name} ${x.phone} ${x.did}`.toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;
      const visible = !isDeleted && matchesArchived && matchesSearch;
      (x.el).style.display = visible ? '' : 'none';
      // update status badge text
      const statusEl = x.el.querySelector('span.rounded');
      if (statusEl) {
        const attrStatus = (x.el.getAttribute('data-status')||'').toLowerCase();
        let s = attrStatus || 'new';
        if (isDeleted) s = 'deleted';
        else if (isArchived && s === 'new') s = 'archived';
        // local quoting override for immediate UI feedback
        if (quoting.has(x.id)) s = 'quoting';
        statusEl.textContent = s;
      }
      if (visible) {
        if (x.type==='row') anyTable=true; else anyCards=true;
      }
    });
    if (emptyRow) emptyRow.classList.toggle('hidden', anyTable);
    if (emptyCards) emptyCards.classList.toggle('hidden', anyCards);
  }

  // archive/unarchive actions
  function refreshArchiveButtons(){
    document.querySelectorAll('.lead-archive').forEach((btn)=>{
      const id = btn.getAttribute('data-id');
      // Prefer DOM attribute state, fallback to localStorage set
      const el = id ? document.querySelector(`[data-raw-id="${id}"]`) : null;
      const attrArch = el ? (el.getAttribute('data-archived')||'').toLowerCase() : '';
      const isA = (attrArch === 'true' || attrArch === '1') || archived.has(id);
      btn.textContent = isA ? 'Unarchive' : 'Archive';
    });
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if (t && t.closest){
      const btn = t.closest('.lead-archive');
      if (btn){
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const willArchive = !archived.has(id);
        if (willArchive) archived.add(id); else archived.delete(id);
        saveArchived(archived);
        // Persist to backend if supported
        fetch('/api/leads/archive', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, archived: willArchive }) }).catch(()=>{});
        // Update DOM attributes for consistency after reload
        document.querySelectorAll(`[data-raw-id="${id}"]`).forEach((el)=>{ try { el.setAttribute('data-archived', willArchive ? 'true' : 'false'); } catch {} });
        refreshArchiveButtons();
        apply();
      }
    }
  });

  search.addEventListener('input', apply);
  toggle.addEventListener('click', ()=>{
    const params = new URLSearchParams(location.search);
    const next = !showArchived;
    params.set('archived', next ? '1' : '0');
    params.set('page', '1');
    const base = location.pathname || '/admin';
    location.href = `${base}?${params.toString()}`;
  });
  updateToggleLabel();
  refreshArchiveButtons();
  apply();

  // expose for modal
  window.leads_applyFilters = apply;
  window.leads_refreshArchiveLabels = refreshArchiveButtons;
  window.loadArchived = loadArchived;
  window.loadDeleted = function(){ return deleted; };
  window.saveDeleted = function(set){ try { localStorage.setItem('bwDeletedLeads', JSON.stringify(Array.from(set))); deleted = set; } catch {} };
}

function nwq_removeLastItem() {
  const wrap = document.getElementById('nwq_items');
  if (!wrap) return;
  const rows = wrap.querySelectorAll('.nwq-item-row');
  if (rows.length > 1) {
    rows[rows.length - 1].remove();
  } else if (rows.length === 1) {
    // Clear inputs in the only row
    const first = rows[0];
    const inputs = first.querySelectorAll('input[data-nwq]');
    inputs.forEach((i) => { i.value = i.getAttribute('data-nwq') === 'qty' ? '1' : '0'; });
    const desc = first.querySelector('input[data-nwq="desc"]');
    if (desc) desc.value = '';
  }
}

// Simple confirm modal
let _confirmAction = null;
function openConfirm({ title, message, variant, onConfirm }) {
  const modal = document.getElementById('adminConfirmModal');
  const titleEl = document.getElementById('adminConfirmTitle');
  const msgEl = document.getElementById('adminConfirmMessage');
  const okBtn = modal.querySelector('[data-confirm="ok"]');
  const cancelBtn = modal.querySelector('[data-confirm="cancel"]');
  const backdrop = modal.querySelector('[data-confirm="backdrop"]');
  if (!modal || !titleEl || !msgEl || !okBtn || !cancelBtn) return;
  titleEl.textContent = title || 'Confirm';
  msgEl.textContent = message || 'Are you sure?';
  // Style variant
  okBtn.classList.remove('bg-primary','bg-red-600');
  okBtn.classList.add(variant === 'danger' ? 'bg-red-600' : 'bg-primary');
  _confirmAction = function(){ try { onConfirm && onConfirm(); } finally { closeConfirm(); } };
  okBtn.onclick = () => { if (_confirmAction) _confirmAction(); };
  cancelBtn.onclick = () => closeConfirm();
  if (backdrop) backdrop.onclick = () => closeConfirm();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeConfirm(){
  const modal = document.getElementById('adminConfirmModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  _confirmAction = null;
}

// realtime client removed
