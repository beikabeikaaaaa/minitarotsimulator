
let deck = [];           
let imgs = {};           
let backImg;             
let drawn = [];         
let slots = [];          
let canvasW, canvasH;

const LAYOUT = {
  maxW: 1100,       
  ratio: 0.56,         
  gap: 28,            
  sidePad: 32,         
  cardW: 220,         
  cardH: 356,         
  titleSize: 18,       
  leading: 20,      
  maxChars: 30         
};


function preload() {
  backImg = loadImage('assets/back.jpg');

  let raw = loadJSON('data/cards.json');
  if (Array.isArray(raw)) deck = raw;
  else deck = Object.values(raw || {});

  for (const c of deck) {
    const f = c.file;
    const path = 'assets/major/' + f;
    imgs[f] = loadImage(
      path,
      () => {},
      () => { console.warn('Missing:', path); imgs[f] = backImg; }
    );
  }
}

function setup() {
  computeCanvasSize();
  const cnv = createCanvas(canvasW, canvasH);
  cnv.parent(document.body);
  imageMode(CENTER);
  textFont('sans-serif');
  textSize(LAYOUT.titleSize);

  computeSlots();

  select('#btnDraw')?.mousePressed(drawThree);
  select('#btnReset')?.mousePressed(resetBoard);
  select('#btnShuffle')?.mousePressed(() => { deck = shuffleArray(deck); });
}

function windowResized() {
  computeCanvasSize();
  resizeCanvas(canvasW, canvasH);
  computeSlots();
}

function computeCanvasSize() {
  const w = min(LAYOUT.maxW, windowWidth * 0.95);
  canvasW = w;
  canvasH = round(w * LAYOUT.ratio);

  const target = map(w, 520, 1100, 170, 240, true);
  LAYOUT.cardW = round(target);
  LAYOUT.cardH = round(target * (356 / 220)); 
}

function computeSlots() {
  const cx = canvasW / 2;
  const y = canvasH * 0.52; 
  const gapX = max(LAYOUT.cardW + 80, canvasW * 0.28);

  slots = [
    { x: cx - gapX, y, side: 'right' },
    { x: cx,        y, side: 'right' },
    { x: cx + gapX, y, side: 'right' }
  ];
}


function draw() {
  clear(); 

  for (let i = 0; i < drawn.length; i++) {
    const d = drawn[i];
    const s = slots[i];
    const img = imgs[d.card.file] || backImg;


    push();
    translate(s.x, s.y);
    if (d.orientation === 'reversed') rotate(PI);
    image(img, 0, 0, LAYOUT.cardW, LAYOUT.cardH);
    pop();

    const caption = buildCaption(d);
    drawCaption(caption, s);
  }
}

function drawThree() {
  if (!Array.isArray(deck) || deck.length === 0) {
    console.warn('No cards loaded. Check data/cards.json.');
    return;
  }
  deck = shuffleArray(deck);
  drawn = [];
  for (let i = 0; i < 3; i++) {
    const card = deck[i];
    const orientation = random() < 0.5 ? 'upright' : 'reversed';
    drawn.push({ card, orientation });
  }
}

function resetBoard() {
  drawn = [];
}

function shuffleArray(a) {
  const copy = [...a];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildCaption(d) {
  const label = d.orientation === 'reversed' ? 'Reversed' : 'Upright';
  const meaning = d.card?.meanings?.[d.orientation] || '';
  return `${label}: ${meaning}`;
}


function drawCaption(textStr, slot) {
  const rightX = slot.x + LAYOUT.cardW * 0.5 + LAYOUT.gap;
  const leftX  = slot.x - LAYOUT.cardW * 0.5 - LAYOUT.gap;
  const baseY  = slot.y + LAYOUT.cardH * 0.5 - 4; 

  const lines = wrapText(textStr, LAYOUT.maxChars);

  let blockW = 0;
  for (const ln of lines) blockW = max(blockW, textWidth(ln));
  blockW = min(blockW, canvasW * 0.4);

  let side = slot.side;
  if (side === 'right' && rightX + blockW > canvasW - LAYOUT.sidePad) side = 'left';
  if (side === 'left'  && leftX  - blockW < LAYOUT.sidePad)           side = 'right';

  const x = (side === 'right') ? rightX : leftX;
  const align = (side === 'right') ? LEFT : RIGHT;

  push();
  noStroke();
  fill(245);
  textSize(LAYOUT.titleSize);
  textLeading(LAYOUT.leading);
  textAlign(align, BOTTOM);

  let y = baseY;
  const step = LAYOUT.leading;
  for (let i = lines.length - 1; i >= 0; i--) {
    const ln = lines[i];
    if (side === 'right') {
      text(ln, x, y);
    } else {
      text(ln, x, y);
    }
    y -= step;
  }
  pop();
}


function wrapText(str, maxChars) {
  const words = (str || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = (line ? line + ' ' : '') + w;
    if (test.length <= maxChars) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}
