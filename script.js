// Mini Tarot — Major Arcana student version with real images where available
const qs = (s,r=document)=>r.querySelector(s); const qsa = (s,r=document)=>Array.from(r.querySelectorAll(s));
const state = { deck: [], drawn: [] };

async function loadDeck(){ const res = await fetch('cards.json',{cache:'no-store'}); return res.json(); }
function shuffle(a){ const r=a.slice(); for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]} return r }
function orientation(){ return Math.random()<0.5?'upright':'reversed'; }

function resetSlots(){
  qsa('.slot').forEach((slot,i)=>{ const c=qs('.card',slot); c.className='card placeholder'; c.innerHTML='<img src="assets/major/card-back.svg" alt="back">'; qs('.cap',slot).textContent=`Card ${i+1}`; });
  qs('#reading').classList.add('hidden'); ['r1','r2','r3'].forEach(id=>qs('#'+id).textContent='');
}

function putCard(slot, draw){
  const cardEl = qs('.card',slot);
  cardEl.className = 'card deal' + (draw.orientation==='reversed'?' reversed':''); cardEl.innerHTML='';
  const img = new Image(); img.src = draw.card.image; img.alt = draw.card.name;
  img.onerror = ()=>{ img.src = 'assets/major/card-back.svg'; }; cardEl.appendChild(img);
  qs('.cap',slot).textContent = `${draw.card.name} • ${draw.orientation}`; cardEl.onclick = ()=>openModal(draw);
}

function openModal(draw){
  qs('#mTitle').textContent = draw.card.name + (draw.orientation==='reversed'?' (Reversed)':'');
  qs('#mImg').src = draw.card.image; qs('#mImg').alt = draw.card.name;
  qs('#mTxt').textContent = draw.card[draw.orientation]; qs('#mMeta').textContent = draw.card.arcana;
  qs('#modal').classList.remove('hidden');
}
function closeModal(){ qs('#modal').classList.add('hidden'); }

async function init(){
  state.deck = await loadDeck(); qs('#btnShuffle').disabled=false;
  qs('#btnShuffle').addEventListener('click',()=>{ state.deck=shuffle(state.deck); state.drawn=[]; resetSlots(); qs('#btnDraw').disabled=false; qs('#btnReset').disabled=false; });
  qs('#btnDraw').addEventListener('click',()=>{ if(state.deck.length<3){ alert('Not enough cards. Shuffle again.'); return; } state.drawn=[]; for(let i=0;i<3;i++){ const card=state.deck.pop(); const o=orientation(); state.drawn.push({card,orientation:o}); } qsa('.slot').forEach((slot,idx)=> setTimeout(()=>putCard(slot, state.drawn[idx]), idx*180)); setTimeout(()=>{ qs('#r1').textContent=`${state.drawn[0].card.name} (${state.drawn[0].orientation}) — ${state.drawn[0][state.drawn[0].orientation]}`; qs('#r2').textContent=`${state.drawn[1].card.name} (${state.drawn[1].orientation}) — ${state.drawn[1][state.drawn[1].orientation]}`; qs('#r3').textContent=`${state.drawn[2].card.name} (${state.drawn[2].orientation}) — ${state.drawn[2][state.drawn[2].orientation]}`; qs('#reading').classList.remove('hidden'); }, 600); });
  qs('#btnReset').addEventListener('click',()=>{ state.drawn=[]; state.deck=shuffle(state.deck); resetSlots(); qs('#btnDraw').disabled=true; });
  qs('#closeModal').addEventListener('click', closeModal); qs('#modal').addEventListener('click',(e)=>{ if(e.target.id==='modal') closeModal(); }); document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });
  resetSlots();
}
window.addEventListener('DOMContentLoaded', init);
