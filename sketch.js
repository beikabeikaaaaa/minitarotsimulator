// Tarot Simulator with p5.js — centered, larger layout
let deck = [];
let imgs = {};
let backImg;
let drawn = [];
let canvasW, canvasH;
let slots = [];

// layout constants
const LAYOUT = {
  cardW: 200,
  cardH: 320,
  gapLarge: 220,
  cardsYFactor: 0.65,   // move cards lower on canvas
  stackY: 100,
  capWidth: 220,
  capHeight: 120,
  capSize: 14,
  capMargin: 16
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

  // preload images
  for (const card of deck) {
    let path = 'assets/major/' + card.file;
    imgs[path] = loadImage(path, () => {}, () => { imgs[path] = backImg; });
  }
}

function windowResized() {
  computeCanvasSize();
  resizeCanvas(canvasW, canvasH);
  computeSlots();
}

function computeCanvasSize() {
  const maxW = min(980, windowWidth * 0.9);
  canvasW = maxW;
  canvasH = round(maxW * 0.62);
}

function computeSlots() {
  const centerX = canvasW / 2;
  const y = canvasH * LAYOUT.cardsYFactor;
  const gap = canvasW > 700 ? LAYOUT.gapLarge : canvasW * 0.26;
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

    // draw card
    push();
    translate(s.x, s.y);
    if (d.orientation === 'reversed') rotate(PI);
    image(img, 0, 0, LAYOUT.cardW, LAYOUT.cardH);
    pop();

    // caption
    const cardRightX = s.x + LAYOUT.cardW / 2;
    const cardLeftX = s.x - LAYOUT.cardW / 2;
    const cardBottomY = s.y + LAYOUT.cardH / 2;
    let capX = cardRightX + 12;
    let capY = cardBottomY;
    let horizAlign = LEFT;

    // overflow check
    if (capX + LAYOUT.capWidth + LAYOUT.capMargin > canvasW) {
      capX = cardLeftX - 12;
      horizAlign = RIGHT;
    }

    const txt = (d.orientation === 'reversed' ? 'Reversed: ' : 'Upright: ')
      + d.card.meanings[d.orientation];
    push();
    textSize(LAYOUT.capSize);
    fill(240);
    textAlign(horizAlign, BOTTOM);
    text(txt, capX, capY, LAYOUT.capWidth, LAYOUT.capHeight);
    pop();
  }
}

function orientation() {
  return random() < 0.5 ? 'upright' : 'reversed';
}

function drawThree() {
  drawn = [];
  shuffle(deck, true);
  for (let i = 0; i < 3; i++) {
    drawn.push({ card: deck[i], orientation: orientation() });
  }
}

function resetBoard() { drawn = []; }
