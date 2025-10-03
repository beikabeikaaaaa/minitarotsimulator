
let deck = [];
let imgs = {};
let backImg;
let drawn = [];
let canvasW, canvasH;
let slots = [];

// Layout
const LAYOUT = {
  cardW: 220,
  cardH: 360,
  gapLarge: 220,
  cardsYFactor: 0.68,  
  stackY: 120,

  capOffsetX: 16,     
  capOffsetY: -4,      
  capWidth: 240,        
  capHeight: 140,       
  capSize: 14,
  capMargin: 16         

function imagePath(card){
  if (card.image) return card.image;                
  return null;
}
function meaningOf(card, orientation){
  if (card.meanings && card.meanings[orientation]) return card.meanings[orientation];
  if (card[orientation]) return card[orientation];
  return '';
}

function preload(){
  backImg = loadImage('assets/major/card-back.svg');
  deck = loadJSON('cards.json');
}

function setup(){
  computeCanvasSize();
  const cnv = createCanvas(canvasW, canvasH);
  cnv.parent('p5-holder');

  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LAYOUT.capSize);

 
  for (const card of deck){
    const p = imagePath(card);
    if (!p) continue;
    if (!imgs[p]){
      imgs[p] = loadImage(p, () => {}, () => { imgs[p] = backImg; });
    }
  }

  computeSlots();

  select('#btnDraw')?.mousePressed(drawThree);
  select('#btnReset')?.mousePressed(resetBoard);
}

function windowResized(){
  computeCanvasSize();
  resizeCanvas(canvasW, canvasH);
  computeSlots();
}

function computeCanvasSize(){
  const maxW = min(980, windowWidth * 0.96);
  canvasW = maxW;
  canvasH = round(maxW * 0.62);
}

function computeSlots(){
  const centerX = canvasW / 2;
  const y = canvasH * LAYOUT.cardsYFactor;
  const gap = canvasW > 700 ? LAYOUT.gapLarge : canvasW * 0.26;

  slots = [
    { x: centerX - gap, y, hover:false },
    { x: centerX,       y, hover:false },
    { x: centerX + gap, y, hover:false }
  ];
}

function draw(){
  clear();

  push();
  translate(canvasW/2, LAYOUT.stackY);
  for (let i=0; i<3; i++){
    push(); translate(i*1.2, -i*1.2); image(backImg, 0, 0, 110, 180); pop();
  }
  pop();

  for (let i=0; i<drawn.length; i++){
    const d = drawn[i];
    const s = slots[i];
    const p = imagePath(d.card);
    const img = (p && imgs[p]) ? imgs[p] : backImg;

    
    push();
    translate(s.x, s.y);
    if (d.orientation === 'reversed') rotate(PI);
    image(img, 0, 0, LAYOUT.cardW, LAYOUT.cardH);
    pop();

    
const cardRightX  = s.x + LAYOUT.cardW / 2;
const cardLeftX   = s.x - LAYOUT.cardW / 2;
const cardBottomY = s.y + LAYOUT.cardH / 2;

const maxWrap = max(140, canvasW * 0.32);
const capW = min(LAYOUT.capWidth, maxWrap);

let capX = cardRightX + LAYOUT.capOffsetX;   
let capY = cardBottomY + LAYOUT.capOffsetY;
let horizAlign = LEFT;

const overflowRight = capX + capW + LAYOUT.capMargin > canvasW;
if (overflowRight) {
  capX = cardLeftX - LAYOUT.capOffsetX - capW;
  horizAlign = RIGHT;
}

if (capX < LAYOUT.capMargin) {
  const usable = (cardLeftX - LAYOUT.capOffsetX) - LAYOUT.capMargin;
  const safeW = max(140, usable);       
  if (horizAlign === RIGHT) {
    capX = cardLeftX - LAYOUT.capOffsetX - safeW;
  }
 
  push();
  textSize(LAYOUT.capSize);
  fill(240);
  if (typeof textWrap === 'function') textWrap(WORD);
  textAlign(horizAlign, BOTTOM);
  const isRev = d.orientation === 'reversed';
  const label = isRev ? 'Reversed: ' : 'Upright: ';
  const textStr = `${label}${meaningOf(d.card, isRev ? 'reversed' : 'upright')}`;
  text(textStr, capX, capY, safeW, LAYOUT.capHeight);
  pop();
} else {
  
  push();
  textSize(LAYOUT.capSize);
  fill(240);
  if (typeof textWrap === 'function') textWrap(WORD);
  textAlign(horizAlign, BOTTOM);
  const isRev = d.orientation === 'reversed';
  const label = isRev ? 'Reversed: ' : 'Upright: ';
  const textStr = `${label}${meaningOf(d.card, isRev ? 'reversed' : 'upright')}`;
  text(textStr, capX, capY, capW, LAYOUT.capHeight);
  pop();
}


  
  for (let i=0; i<drawn.length; i++){
    const s = slots[i];
    s.hover = (
      mouseX > s.x - LAYOUT.cardW/2 && mouseX < s.x + LAYOUT.cardW/2 &&
      mouseY > s.y - LAYOUT.cardH/2 && mouseY < s.y + LAYOUT.cardH/2
    );
  }
}

function mousePressed(){
  for (let i=0; i<drawn.length; i++){
    const s = slots[i];
    if (s.hover){
      drawn[i].orientation = (drawn[i].orientation === 'upright') ? 'reversed' : 'upright';
      updateReading();
      break;
    }
  }
}

function keyPressed(){ if (key==='r' || key==='R') reshuffle(); }
function reshuffle(){ deck = shuffle(deck); }
function shuffle(arr){ const a=[...arr]; for (let i=a.length-1;i>0;i--){ const j=floor(random(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }
function orientation(){ return random()<0.5 ? 'upright' : 'reversed' }

function drawThree(){
  reshuffle(); drawn=[];
  for (let i=0;i<3;i++){ const c=deck.pop(); drawn.push({ card:c, orientation: orientation() }); }
  updateReading();
}
function resetBoard(){ drawn=[]; updateReading(); }


function updateReading(){
  const r1 = select('#r1'), r2 = select('#r2'), r3 = select('#r3');
  const textFor = (d) => `${d.card.name} (${d.orientation}) — ${meaningOf(d.card, d.orientation)}`;
  if (drawn.length===3){ r1?.html(textFor(drawn[0])); r2?.html(textFor(drawn[1])); r3?.html(textFor(drawn[2])); }
  else { r1?.html(''); r2?.html(''); r3?.html(''); }
}
