const DECKSIZE = 52;
const SUITSIZE = 13;
const HANDSIZE = 5;

class Card {
  constructor(suit, rank, suit_symbol, rank_symbol) {
    this.suit = suit;
    this.rank = rank;
    this.suit_symbol = suit_symbol;
    this.rank_symbol = rank_symbol;
  }
}

function generateDeck() {
  let deck = [];
  
  const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
  const suits_symbol = ['&#x2665;', '&#x2666;', '&#x2660;', '&#x2663;'];
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
  const ranks_symbol = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  let suitIndex = 0;
  let rankIndex = 0;
  for(let i=0; i<DECKSIZE; i++) {
    let card = new Card(suits[suitIndex], ranks[rankIndex], suits_symbol[suitIndex], ranks_symbol[rankIndex]);
    deck[i] = card;
    
    if(rankIndex < SUITSIZE-1) {
      rankIndex++;
    } else {
      suitIndex++;
      rankIndex = 0;
    }
  }

  return deck;
}


/* Shuffle functions */

/** Grabs a section of cards in the middle and transfers to the end of the deck. Is not efficient for shuffling.
 * 
 * @param {*} deck 
 * @returns array
 */
let shuffle_overhand = (deck) => {
  const startPoint = Math.floor(Math.random()*DECKSIZE);
  const endPoint = startPoint + Math.floor(Math.random()*(DECKSIZE-startPoint));
    
  let firstSplitCards = deck.slice(0, startPoint);
  let overhandCards = deck.slice(startPoint, endPoint);
  let thirdSplitCards = deck.slice(endPoint, deck.length);
  
  return [...firstSplitCards, ...thirdSplitCards, ...overhandCards];
}

/** Splits the deck into two and release into each other interleaved.
 * 
 * @param {*} deck 
 * @returns array
 */
let shuffle_riffle = (deck) => {
  let shuffledDeck = [];
  const breakpoint = setBreakPoint();

  let leftHand = deck.slice(0, breakpoint);
  let rightHand = deck.slice(breakpoint, deck.length);
  
  let lindex = 0;
  let rindex = 0;
  let i = 0;
  while(lindex < leftHand.length || rindex < rightHand.length) {
    if(i % 2) {
      if(leftHand[lindex]) {
        shuffledDeck.push(leftHand[lindex]);
        lindex++;
      }
    } else {
      if(rightHand[rindex]) {
        shuffledDeck.push(rightHand[rindex]);
        rindex++;
      }
    }
    i++;
  }
  
  return shuffledDeck;
}

/** Splits deck into multiple piles and randomly stacked on each other.
 * 
 * @param {*} deck
 * @returns array
 */
let shuffle_pile = (deck) => {
  let shuffledDeck = [];

  let availableNumbers = [];
  for(let i=0; i<DECKSIZE; i++) {
    availableNumbers.push(i);
  }
  let splitPoints = [0];

  const PILE_COUNT = 5;

  // optional block for having fixed amount of unique piles
  for(let i=0; i<PILE_COUNT-1; i++) {
    let drawnNumber = Math.floor(Math.random()*availableNumbers.length);
    splitPoints.push(drawnNumber);
    availableNumbers.splice(drawnNumber,1);
  }
  splitPoints[PILE_COUNT] = deck.length;
  
  splitPoints.sort((a,b)=>a-b); // sort by integer
    
  let cardPiles = [];
  for(let i=0; i<splitPoints.length-1; i++) {
    let startPoint = splitPoints[i];
    let nextPoint = splitPoints[i+1];
    cardPiles[i] = deck.slice(startPoint, nextPoint);
  }
  
  let pile_length = cardPiles.length
  for(let i=0; i<pile_length; i++) {
    let pilePick = Math.floor(Math.random()*cardPiles.length);
    shuffledDeck.push(...cardPiles[pilePick])
    cardPiles.splice(pilePick, 1)
  }
  
  return shuffledDeck;
}

/** Splits the deck into two and combines in reverse order to assure the dealer hasn't cheated.
 * 
 * @param {*} deck 
 * @returns array
 */
let shuffle_cut = (deck) => {
  const breakpoint = setBreakPoint();
  
  let firstHalf = deck.slice(0, breakpoint);
  let secondHalf = deck.slice(breakpoint, deck.length);
  
  return [...secondHalf, ...firstHalf];
}

/** Sets a middle-point somewhere in the deck to split the pile
 * favor the middle (bellcurve) with average of two random numbers between 1 and 52
 * 
 * @returns integer
 */
function setBreakPoint() {
  const firstNum = Math.random()*DECKSIZE;
  const secondNum = Math.random()*DECKSIZE;

  return Math.floor((firstNum+secondNum)/2);
}


// Gameplay functions

function shuffle(deck) {
  let shuffledDeck = [...deck];

  for(let i=0; i<10; i++) {
    shuffledDeck = shuffle_overhand(shuffledDeck);
  }
  shuffledDeck = shuffle_riffle(shuffledDeck);
  shuffledDeck = shuffle_pile(shuffledDeck);
  for(let i=0; i<10; i++) {
    shuffledDeck = shuffle_overhand(shuffledDeck);
  }
  shuffledDeck = shuffle_riffle(shuffledDeck);
  shuffledDeck = shuffle_pile(shuffledDeck);
  shuffledDeck = shuffle_cut(shuffledDeck);

  return shuffledDeck;
}

function gameloop() {
  const deck = generateDeck()

  let shuffledDeck = shuffle(deck);
  
  let hand = [];
  let hold = ['','','','',''];
  let secondRound = false;

  window.addEventListener("load", function() {
    playRound();
  });

  function playRound() {
    drawHand();
    renderCards();

    secondRound = !secondRound;
  }

  function drawHand() {
    for(let i=0; i<HANDSIZE; i++) {
      hand[i] = hold[i]=='' ? shuffledDeck.shift() : hold[i];
    }
    hold = ['','','','',''];
  }

  function renderCards() {
    for(let i=0; i<hand.length; i++) {
      const red_cards = ['Hearts', 'Diamonds'];
      const black_cards = ['Clubs', 'Spades'];
  
      let color = 'black';
      if(red_cards.includes(hand[i].suit)) {
        color = 'red';
      }
  
      // Assign cards suit and rank
      let card = document.getElementById(`card_${i}`);
      card.innerHTML = `<span class='${color}'>${hand[i].suit_symbol}${hand[i].rank_symbol}</span>`;
      card.classList.remove('holding');
    }
  }

  // Click to hold card
  for(let i=0; i<HANDSIZE; i++) {
    document.getElementById(`card_${i}`).addEventListener('click', (e) => {
      let select_slot = e.target.getAttribute('id').slice(-1);

      if(!e.target.classList.contains('holding')) {
        e.target.classList.add('holding');
        hold[select_slot] = hand[select_slot];
      } else {
        e.target.classList.remove('holding');
        hold[select_slot] = '';
      }
    });
  }

  document.getElementById(`button_draw`).addEventListener('click', (e) => {
    e.preventDefault;
    playRound();
  });
}

gameloop();
