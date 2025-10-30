// Quote detail client script (bundled by Vite)
(function(){
  function getQuoteId(){
    const root = document.querySelector('[data-quote-id]');
    return root ? root.getAttribute('data-quote-id') : '';
  }
  const QUOTE_ID = getQuoteId();
  if (!QUOTE_ID) return;

  let quoteData = null;
  function fmt(cur, v){ return `${cur} ${v}`; }
  function showToast(msg){ const t=document.getElementById('toast'); if(!t) return; t.children[1].textContent=msg; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'), 1500); }

  async function fetchQuote(){
    const res = await fetch(`/api/quotes/${QUOTE_ID}`);
    const j = await res.json().catch(()=>({}));
    if (!j || !j.ok) return;
    const d = j.data; quoteData = d;
    const tEl = document.getElementById('qTitle');
    if (tEl) tEl.textContent = `Quote #${d.originEnquiryId || d.id}`;
    const st = document.getElementById('qStatus'); if (st) st.textContent = d.status;
    const bn = document.getElementById('billName'); if (bn) bn.textContent = d.billToName || '-';
    const be = document.getElementById('billEmail'); if (be) be.textContent = d.billToEmail || '-';
    const bp = document.getElementById('billPhone'); if (bp) bp.textContent = d.billToPhone || '';
    const cur = document.getElementById('currency'); if (cur) cur.textContent = d.currency;
    const vu = document.getElementById('validUntil'); if (vu) vu.textContent = d.validUntil ? new Date(d.validUntil).toISOString().slice(0,10) : '-';
    const nt = document.getElementById('notes'); if (nt) nt.textContent = d.notes || '-';
    const sb = document.getElementById('subtotal'); if (sb) sb.textContent = fmt(d.currency, d.subtotal);
    const tx = document.getElementById('taxes'); if (tx) tx.textContent = fmt(d.currency, d.taxes);
    const tt = document.getElementById('total'); if (tt) tt.textContent = fmt(d.currency, d.total);
    const tbody = document.getElementById('itemsBody'); if (tbody) {
      tbody.innerHTML = '';
      (d.items||[]).forEach((i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="px-6 py-4 text-sm">${i.description}</td><td class="px-6 py-4 text-sm text-right">${i.qty}</td><td class="px-6 py-4 text-sm text-right">${d.currency} ${i.unitPrice}</td><td class="px-6 py-4 text-sm text-right">${d.currency} ${((+i.qty)*(+i.unitPrice)).toFixed(2)}</td>`;
        tbody.appendChild(tr);
      });
    }
  }

  async function send(){
    const res = await fetch('/api/quotes/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ quoteId: QUOTE_ID })});
    const j = await res.json().catch(()=>({}));
    if(!j || !j.ok) return alert('Send failed');
    const text = `ES\n${j.data.textES}\n\nEN\n${j.data.textEN}`;
    const sEl = document.getElementById('sendText'); if (sEl) sEl.textContent = text;
    const out = document.getElementById('sendOut'); if (out) out.classList.remove('hidden');
    showToast('Quote sent');
  }

  function copySendText(){
    const t = (document.getElementById('sendText')||{}).textContent || '';
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t);
  }

  async function accept(){
    const res = await fetch('/api/quotes/accept', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ quoteId: QUOTE_ID })});
    const j = await res.json().catch(()=>({}));
    if(!j || !j.ok) return alert('Accept failed');
    showToast('Quote accepted');
    fetchQuote();
  }

  async function decline(){
    const res = await fetch('/api/quotes/decline', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ quoteId: QUOTE_ID })});
    const j = await res.json().catch(()=>({}));
    if(!j || !j.ok) return alert('Decline failed');
    showToast('Quote declined');
    fetchQuote();
  }

  async function convert(){
    const res = await fetch(`/api/billing/invoices/create?quoteId=${QUOTE_ID}`, { method:'POST' });
    const j = await res.json().catch(()=>({}));
    if (!j || !j.ok) return alert('Convert failed');
    location.href = `/admin/billing/invoices/${j.data.invoiceId}`;
  }

  document.addEventListener('DOMContentLoaded', fetchQuote);
  // Expose functions for inline onclicks
  window.send = send;
  window.accept = accept;
  window.decline = decline;
  window.convert = convert;
  window.copySendText = copySendText;
})();

