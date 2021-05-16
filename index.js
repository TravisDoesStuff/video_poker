const DECKSIZE = 52;
const SUITSIZE = 13;

class Card {
  constructor(id, suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
}

function generateDeck() {
  let deck = [];
  
  const suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
  
  let suitIndex = 0;
  let rankIndex = 0;
  for(let i=0; i<DECKSIZE; i++) {
    let card = new Card(i, suits[suitIndex], ranks[rankIndex]);
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

let deck = generateDeck()

