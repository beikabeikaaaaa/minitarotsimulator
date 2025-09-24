const state = {
  deck: [],
  drawn: [],
  ready: false
};

const els = {};
function qs(sel,root=document){ return root.querySelector(sel); }
function qsa(sel,root=document){ return Array.from(root.querySelectorAll(sel)); }

async function loadDeck(){
  // Always present a bundled cards.json (22 Major Arcana with placeholder images)
  const res = await fetch('cards.json', {cache:'no-store'});
  const data = await res.json();
  return data;
}

function shuffle(array){
  const a = array.slice();
  for(let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function orientation(){ return Math.random() < 0.5 ? 'upright' : 'reversed'; }

function resetUI(){
  els.slots.forEach(slot => {
    const c = qs('.card', slot);
    c.className = 'card placeholder';
    c.innerHTML = '<div class="back">?</div>';
    qs('.caption', slot).textContent = `Card ${slot.dataset.pos}`;
  });
  els.readings.classList.add('hidden');
  [els.r1,els.r2,els.r3].forEach(el => el.innerHTML = '');
}

function populateSlot(slot, draw){
  const c = qs('.card', slot);
  c.className = 'card deal' + (draw.orientation==='reversed' ? ' reversed' : '');
  c.innerHTML = '';
  const img = document.createElement('img');
  img.src = draw.card.image;
  img.alt = draw.card.name;
  c.appendChild(img);
  qs('.caption', slot).textContent = `${draw.card.name} • ${draw.orientation}`;
  c.onclick = () => openModal(draw);
}

function openModal(draw){
  els.modalTitle.textContent = draw.card.name + (draw.orientation==='reversed' ? ' (Reversed)' : '');
  els.modalImg.src = draw.card.image;
  els.modalImg.alt = draw.card.name;
  els.modalMeta.textContent = [draw.card.arcana, draw.card.suit ? '• '+draw.card.suit : null].filter(Boolean).join('  ');
  els.modalMeaning.textContent = draw.card[draw.orientation] || '';
  els.modal.classList.remove('hidden');
}
function closeModal(){ els.modal.classList.add('hidden'); }

function attachRipple(){
  qsa('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - r.left}px`);
      btn.style.setProperty('--y', `${e.clientY - r.top}px`);
      btn.classList.add('is-pressed');
      setTimeout(()=>btn.classList.remove('is-pressed'), 360);
    });
  });
}

async function init(){
  els.shuffleBtn = qs('#shuffleBtn');
  els.drawBtn = qs('#drawBtn');
  els.resetBtn = qs('#resetBtn');
  els.slots = qsa('.slot');
  els.readings = qs('#readings');
  els.r1 = qs('#r1');
  els.r2 = qs('#r2');
  els.r3 = qs('#r3');
  els.modal = qs('#modal');
  els.modalTitle = qs('#modalTitle');
  els.modalImg = qs('#modalImg');
  els.modalMeta = qs('#modalMeta');
  els.modalMeaning = qs('#modalMeaning');
  els.modalClose = qs('#modalClose');

  els.modal.addEventListener('click', e => { if(e.target === els.modal) closeModal(); });
  els.modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  attachRipple();

  state.deck = await loadDeck();
  state.ready = true;
  els.shuffleBtn.disabled = false;

  els.shuffleBtn.addEventListener('click', onShuffle);
  els.drawBtn.addEventListener('click', onDraw);
  els.resetBtn.addEventListener('click', onReset);
}

function onShuffle(){
  if(!state.ready) return;
  state.drawn = [];
  state.deck = shuffle(state.deck);
  resetUI();
  els.drawBtn.disabled = false;
  els.resetBtn.disabled = false;
}

function onDraw(){
  if(state.deck.length < 3){
    alert('Not enough cards left. Shuffle again.');
    return;
  }
  state.drawn = [];
  for(let i=0;i<3;i++){
    const card = state.deck.pop();
    const o = orientation();
    state.drawn.push({ card, orientation: o });
  }
  state.drawn.forEach((d, idx)=> setTimeout(()=> populateSlot(els.slots[idx], d), idx*180));
  const fmt = (d, i) => {
    const dot = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d.orientation==='upright'?'#22c55e':'#06b6d4'};margin-right:8px;"></span>`;
    return `${dot}<strong>Card ${i+1}</strong> — ${d.card.name} (${d.orientation}): ${d[d.orientation]}`;
  };
  setTimeout(()=>{
    els.r1.innerHTML = fmt(state.drawn[0],0);
    els.r2.innerHTML = fmt(state.drawn[1],1);
    els.r3.innerHTML = fmt(state.drawn[2],2);
    els.readings.classList.remove('hidden');
  }, 600);
}

function onReset(){
  resetUI();
  if(state.drawn.length){
    state.deck = state.deck.concat(state.drawn.map(d=>d.card));
  }
  state.deck = shuffle(state.deck);
  state.drawn = [];
  els.drawBtn.disabled = true;
}

window.addEventListener('DOMContentLoaded', init);
