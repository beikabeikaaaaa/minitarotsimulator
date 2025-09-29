// p5 Tarot 
let deck = [];
let imgs = {};
let backImg;
let drawn = [];
let canvasW, canvasH;
let slots = [];


const LAYOUT = {
  cardW: 220,
  cardH: 360,
  gapLarge: 220,
  cardsYFactor: 0.68,  
  stackY: 120,

  capOffsetX: 16,      
  capOffsetY: -4,      
  capWidth: 220,       
  capSize: 14         
};

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
    if (!imgs[card.image]) {
      imgs[card.image] = loadImage(
        card.image,
        () => {},
        () => { imgs[card.image] = backImg; }
      );
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
    { x: centerX - gap, y, hover: false },
    { x: centerX,       y, hover: false },
    { x: centerX + gap, y, hover: false }
  ];
}

function draw(){
  clear();

  push();
  translate(canvasW / 2, LAYOUT.stackY);
  for (let i = 0; i < 3; i++){
    push();
    translate(i * 1.2, -i * 1.2);
    image(backImg, 0, 0, 110, 180);
    pop();
  }
  pop();
  
  for (let i = 0; i < drawn.length; i++){
    const d = drawn[i];
    const s = slots[i];
    const img = imgs[d.card.image] || backImg;

    push();
    translate(s.x, s.y);
    if (d.orientation === 'reversed') rotate(PI);
    image(img, 0, 0, LAYOUT.cardW, LAYOUT.cardH);
    pop();


    const cardRightX = s.x + LAYOUT.cardW / 2;
    const cardBottomY = s.y + LAYOUT.cardH / 2;

    const capX = cardRightX + LAYOUT.capOffsetX;             
    const capY = cardBottomY + LAYOUT.capOffsetY;            

    const isRev = d.orientation === 'reversed';
    const label = isRev ? 'Reversed: ' : 'Upright: ';
    const textStr = `${label}${d.card[isRev ? 'reversed' : 'upright']}`;

    push();
    textSize(LAYOUT.capSize);
    textWrap(WORD);
    textAlign(LEFT, BOTTOM);                                   
    fill(240);
    
    text(textStr, capX, capY, LAYOUT.capWidth);
    pop();
  }

  
  for (let i = 0; i < drawn.length; i++){
    const s = slots[i];
    s.hover = (
      mouseX > s.x - LAYOUT.cardW / 2 && mouseX < s.x + LAYOUT.cardW / 2 &&
      mouseY > s.y - LAYOUT.cardH / 2 && mouseY < s.y + LAYOUT.cardH / 2
    );
  }
}

function mousePressed(){
  
  for (let i = 0; i < drawn.length; i++){
    const s = slots[i];
    if (s.hover){
      drawn[i].orientation = (drawn[i].orientation === 'upright') ? 'reversed' : 'upright';
      updateReading();
      break;
    }
  }
}

function keyPressed(){ if (key === 'r' || key === 'R') reshuffle(); }

function reshuffle(){ deck = shuffle(deck); }

function shuffle(arr){
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--){
    const j = floor(random(i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function orientation(){ return random() < 0.5 ? 'upright' : 'reversed'; }

function drawThree(){
  reshuffle();
  drawn = [];
  for (let i = 0; i < 3; i++){
    const c = deck.pop();
    drawn.push({ card: c, orientation: orientation() });
  }
  updateReading();
}

function resetBoard(){ drawn = []; updateReading(); }

function updateReading(){
  
  const r1 = select('#r1'), r2 = select('#r2'), r3 = select('#r3');
  if (drawn.length === 3){
    r1?.html(`${drawn[0].card.name} (${drawn[0].orientation}) — ${drawn[0].card[drawn[0].orientation]}`);
    r2?.html(`${drawn[1].card.name} (${drawn[1].orientation}) — ${drawn[1].card[drawn[1].orientation]}`);
    r3?.html(`${drawn[2].card.name} (${drawn[2].orientation}) — ${drawn[2].card[drawn[2].orientation]}`);
  } else {
    r1?.html(''); r2?.html(''); r3?.html('');
  }
}
