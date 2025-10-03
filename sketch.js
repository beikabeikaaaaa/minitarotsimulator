// Tarot Simulator with p5.js — centered layout + caption fix
let deck = [];
let imgs = {};
let backImg;
let drawn = [];
let canvasW, canvasH;
let slots = [];

const LAYOUT = {
  cardW: 220,
  cardH: 352,
  gapLarge: 260,
  cardsYFactor: 0.64,
  capWidth: 260,
  capHeight: 120,
  capSize: 16,
  capMargin: 20
};

function preload() {
  backImg = loadImage('assets/back.jpg');
  deck = loadJSON('data/cards.json');
}

function setup() {
  computeCanvasSize();
  const cnv = createCanvas(canvasW, canvasH);
  cnv.parent('p5-holder');
  imageMode(CENTER);
  textSize(LAYOUT.capSize);
  computeSlots();

  select('#btnDraw')?.mousePressed(drawThree);
  select('#btnReset')?.mousePressed(resetBoard);
  select('#btnShuffle')?.mousePressed(()=>shuffle(deck,true));

  for (const card of deck) {
    const path = 'assets/major/' + card.file;
    imgs[path] = loadImage(path, ()=>{}, ()=>{ imgs[path] = backImg; });
  }
}

function windowResized() {
  computeCanvasSize();
  resizeCanvas(canvasW, canvasH);
  computeSlots();
}

function computeCanvasSize() {
  const maxW = min(1180, windowWidth * 0.92);
  canvasW = maxW;
  canvasH = round(maxW * 0.56);
}

function computeSlots() {
  const centerX = canvasW / 2;
  const y = canvasH * LAYOUT.cardsYFactor;
  const gap = canvasW > 800 ? LAYOUT.gapLarge : canvasW * 0.28;
  slots = [
    { x: centerX - gap, y },
    { x: centerX, y },
    { x: centerX + gap, y }
  ];
}

function draw() {
  clear();
  for (let i = 0; i < drawn.length; i++) {
    const d = drawn[i];
    const s = slots[i];
    const img = imgs['assets/major/' + d.card.file] || backImg;

    // draw card (rotate if reversed)
    push();
    translate(s.x, s.y);
    if (d.orientation === 'reversed') rotate(PI);
    image(img, 0, 0, LAYOUT.cardW, LAYOUT.cardH);
    pop();

    // caption anchored to card's bottom-right (or bottom-left if overflow)
    const cardRightX = s.x + LAYOUT.cardW / 2;
    const cardLeftX = s.x - LAYOUT.cardW / 2;
    const cardBottomY = s.y + LAYOUT.cardH / 2;
    let capX = cardRightX + 14;
    let capY = cardBottomY;
    let horizAlign = LEFT;

    if (capX + LAYOUT.capWidth + LAYOUT.capMargin > canvasW) {
      capX = cardLeftX - 14;
      horizAlign = RIGHT;
    }

    const txt = (d.orientation==='reversed' ? 'Reversed: ' : 'Upright: ') + d.card.meanings[d.orientation];
    push();
    textSize(LAYOUT.capSize);
    fill(240);
    textAlign(horizAlign, BOTTOM);
    text(txt, capX, capY, LAYOUT.capWidth, LAYOUT.capHeight);
    pop();
  }
}

function orientation(){ return random()<0.5 ? 'upright':'reversed'; }

function drawThree(){
  drawn = [];
  shuffle(deck, true);
  for (let i = 0; i < 3; i++) {
    drawn.push({ card: deck[i], orientation: orientation() });
  }
}

function resetBoard(){ drawn = []; }
