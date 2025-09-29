// Mini Tarot — 3‑Card Draw (Majors Only)
// Uses data/cards.json and tries multiple filename fallbacks for your existing assets.

const cardsEl = document.getElementById('cards');
const drawBtn = document.getElementById('drawBtn');
const resetBtn = document.getElementById('resetBtn');

let ALL_CARDS = [];

async function loadData() {
  try {
    const res = await fetch('data/cards.json');
    ALL_CARDS = await res.json();
  } catch (e) {
    console.error('Failed to load cards.json', e);
    ALL_CARDS = [];
  }
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Given a card object, build candidate filenames to try
function candidateImagePaths(card) {
  const base = 'assets/major/';
  const slug = card.slug || card.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const idx = typeof card.index === 'number' ? String(card.index).padStart(2, '0') : null;

  const exts = ['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG','.webp','.WEBP'];
  const variants = new Set();

  // Preferred: slug
  exts.forEach(ext => variants.add(`${base}${slug}${ext}`));
  // index + slug
  if (idx) exts.forEach(ext => variants.add(`${base}${idx}-${slug}${ext}`));
  // TitleCase no space
  const noSpace = (card.name || '').replace(/\s+/g, '');
  exts.forEach(ext => variants.add(`${base}${noSpace}${ext}`));
  // TitleCase with dashes (basic)
  const dashedTitle = (card.name || '').toLowerCase().replace(/\s+/g, '-');
  exts.forEach(ext => variants.add(`${base}${dashedTitle}${ext}`));

  // Last resort: placeholder
  variants.add('assets/placeholder.jpg');
  return Array.from(variants);
}

// Try loading candidates in order until one succeeds, then set img.src
function setImageWithFallback(img, card) {
  const candidates = candidateImagePaths(card);
  let i = 0;
  function tryNext() {
    if (i >= candidates.length) return; // Already used placeholder
    const url = candidates[i++];
    const testImg = new Image();
    testImg.onload = () => { img.src = url; };
    testImg.onerror = tryNext;
    testImg.src = url;
  }
  tryNext();
}

// Create a card element
function createCardEl(card, reversed=false) {
  const el = document.createElement('article');
  el.className = 'card' + (reversed ? ' reversed' : '');

  const vis = document.createElement('div');
  vis.className = 'card-visual';
  const img = document.createElement('img');
  img.alt = card.name;
  setImageWithFallback(img, card);
  vis.appendChild(img);

  const meta = document.createElement('div');
  meta.className = 'meta';

  const h3 = document.createElement('h3');
  h3.className = 'card-name';
  h3.innerHTML = `<span>${card.name}</span> <span class="badge">${reversed ? 'Reversed' : 'Upright'}</span>`;

  const meaning = document.createElement('p');
  meaning.className = 'meaning';
  meaning.textContent = reversed ? (card.meanings?.reversed || '—') : (card.meanings?.upright || '—');

  meta.appendChild(h3);
  meta.appendChild(meaning);

  el.appendChild(vis);
  el.appendChild(meta);

  // Toggle meaning on click/tap; show on hover via CSS on desktop
  el.addEventListener('click', () => {
    el.classList.toggle('show-meaning');
  });

  return el;
}

function drawThree() {
  if (!ALL_CARDS.length) return;

  // majors only (type === 'major')
  const majors = ALL_CARDS.filter(c => c.type === 'major');
  shuffle(majors);

  const pick = majors.slice(0, 3).map(c => ({
    card: c,
    reversed: Math.random() < 0.5
  }));

  // Render
  cardsEl.innerHTML = '';
  pick.forEach(({card, reversed}) => {
    const el = createCardEl(card, reversed);
    cardsEl.appendChild(el);
  });
}

async function init() {
  await loadData();
  drawBtn.addEventListener('click', drawThree);
  resetBtn.addEventListener('click', () => {
    cardsEl.innerHTML = '';
  });
}

init();
