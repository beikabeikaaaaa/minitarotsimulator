const cardsContainer = document.getElementById('cards');
const drawBtn = document.getElementById('btnDraw');
const resetBtn = document.getElementById('btnReset');
const shuffleBtn = document.getElementById('btnShuffle');

let deck = [];

fetch('data/cards.json')
  .then(res => res.json())
  .then(data => { deck = data; });

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createCardElement(card) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');
  const inner = document.createElement('div');
  inner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  const frontImg = document.createElement('img');
  frontImg.src = `assets/major/${card.file}`;
  frontImg.onerror = () => { frontImg.src = 'assets/back.jpg'; }; // fallback
  front.appendChild(frontImg);

  const back = document.createElement('div');
  back.classList.add('card-back');
  const backImg = document.createElement('img');
  backImg.src = 'assets/back.jpg';
  back.appendChild(backImg);

  inner.appendChild(front);
  inner.appendChild(back);
  cardDiv.appendChild(inner);

  // upright/ reversed
  const isReversed = Math.random() < 0.5;
 if (isReversed) {
  frontImg.style.transform = "rotate(180deg)";
}

  const meaning = document.createElement('div');
  meaning.classList.add('meaning');
  meaning.textContent = isReversed 
    ? `Reversed: ${card.meanings.reversed}` 
    : `Upright: ${card.meanings.upright}`;
  meaning.style.display = 'none';

  cardDiv.addEventListener('click', () => {
    cardDiv.classList.toggle('flipped');
    meaning.style.display = meaning.style.display === 'none' ? 'block' : 'none';
  });

  cardsContainer.appendChild(cardDiv);
  cardsContainer.appendChild(meaning);
}

drawBtn.addEventListener('click', () => {
  cardsContainer.innerHTML = '';
  const selected = [];
  while (selected.length < 3) {
    const r = Math.floor(Math.random() * deck.length);
    if (!selected.includes(r)) selected.push(r);
  }
  selected.forEach(i => createCardElement(deck[i]));
});

resetBtn.addEventListener('click', () => {
  cardsContainer.innerHTML = '';
});

shuffleBtn.addEventListener('click', () => {
  shuffleDeck();
  alert("Deck shuffled!");
});
