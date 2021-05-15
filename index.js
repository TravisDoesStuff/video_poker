const DECKSIZE = 52;

let deck = [];
for(let i=0; i<DECKSIZE; i++) {
  deck.push(i);
}

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
  const breakpoint = setBreakPoint();

  let leftHand = deck.slice(0, breakpoint);
  let rightHand = deck.slice(breakpoint, deck.length);

  let l_index = 0;
  let r_index = 0;
  let shuffledDeck = [];
  for(let i=0; i<deck.length; i++) {
    if(i % 2) {
      shuffledDeck.push(leftHand[l_index]);
      l_index++;
    } else {
      shuffledDeck.push(rightHand[r_index]);
      r_index++;
    }
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

  let availableNumbers = [...deck]; // shallow copy
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
    let pile = deck.slice(startPoint, nextPoint);
    cardPiles.push(pile)
  }
  
  for(let i=0; i<cardPiles.length; i++) {
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