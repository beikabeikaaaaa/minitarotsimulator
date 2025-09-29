// p5 Tarot — centered layout variant
let deck = [];
let imgs = {};
let backImg;
let drawn = [];
let canvasW, canvasH;
let slots = []; // 3 positions responsive

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
  textSize(14);

  // Preload images
  for (const card of deck){
    if (!imgs[card.image]) imgs[card.image] = loadImage(card.image, ()=>{}, ()=>{ imgs[card.image]=backImg; });
  }

  computeSlots();

  select('#btnDraw').mousePressed(drawThree);
  select('#btnReset').mousePressed(resetBoard);
}

function windowResized(){
  computeCanvasSize();
  resizeCanvas(canvasW, canvasH);
  computeSlots();
}

function computeCanvasSize(){
  const maxW = min(920, windowWidth*0.94);
  canvasW = maxW;
  canvasH = round(maxW * 0.56); // 16:9-ish
}

function computeSlots(){
  const centerX = canvasW/2;
  const y = canvasH/2;
  const gap = canvasW>700 ? 180 : canvasW*0.22;
  slots = [
    {x:centerX-gap, y:y, hover:false},
    {x:centerX,     y:y, hover:false},
    {x:centerX+gap, y:y, hover:false}
  ];
}

function draw(){
  clear(); // transparent canvas; background handled by CSS
  // Stack preview at top (subtle, centered above)
  push();
  translate(canvasW/2, 70);
  for (let i=0;i<3;i++){
    push(); translate(i*1.2, -i*1.2); image(backImg, 0, 0, 90, 148); pop();
  }
  pop();

  // render cards
  for (let i=0;i<drawn.length;i++){
    const d = drawn[i]; const s = slots[i];
    const img = imgs[d.card.image] || backImg;
    push();
    translate(s.x, s.y); if (d.orientation==='reversed') rotate(PI);
    image(img, 0, 0, 150, 244);
    pop();
    // caption centered under card
    noStroke(); fill(245); text(`${d.card.name} • ${d.orientation}`, s.x, s.y + 150);
    backImg = loadImage('assets/major/card-back.svg');
    if (d.orientation === 'reversed') rotate(PI);

  }

  // hover detect
  for (let i=0;i<drawn.length;i++){
    const s = slots[i];
    s.hover = (mouseX > s.x-75 && mouseX < s.x+75 && mouseY > s.y-122 && mouseY < s.y+122);
  }
}

function mousePressed(){
  // flip a card when clicking on it
  for (let i=0;i<drawn.length;i++){
    const s = slots[i];
    if (s.hover){
      drawn[i].orientation = (drawn[i].orientation==='upright') ? 'reversed' : 'upright';
      updateReading();
      break;
    }
  }
}

function keyPressed(){ if (key==='r' || key==='R') reshuffle(); }
function reshuffle(){ deck = shuffle(deck); }
function shuffle(arr){ const a=[...arr]; for (let i=a.length-1;i>0;i--){ const j=floor(random(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }
function orientation(){ return random()<0.5?'upright':'reversed' }

function drawThree(){
  reshuffle(); drawn = [];
  for (let i=0;i<3;i++){ const c=deck.pop(); drawn.push({card:c, orientation: orientation()}); }
  updateReading();
}
function resetBoard(){ drawn=[]; updateReading(); }

function updateReading(){
  const r1 = select('#r1'), r2 = select('#r2'), r3 = select('#r3');
  if (drawn.length===3){
    r1.html(`${drawn[0].card.name} (${drawn[0].orientation}) — ${drawn[0].card[drawn[0].orientation]}`);
    r2.html(`${drawn[1].card.name} (${drawn[1].orientation}) — ${drawn[1].card[drawn[1].orientation]}`);
    r3.html(`${drawn[2].card.name} (${drawn[2].orientation}) — ${drawn[2].card[drawn[2].orientation]}`);
  } else { r1.html(''); r2.html(''); r3.html(''); }
}
