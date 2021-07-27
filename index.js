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
 * Might need to throw in a few more numbers to reduce the size of the bell curve
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

    let playButton = document.getElementById('button_draw');

    if(secondRound) {
      let winningHand = checkHand();
      document.getElementById(winningHand.toLowerCase().split(' ').join('_')).classList.add('winning_payout_row');
      playButton.innerText = 'Replay';
      Array.from(document.querySelectorAll(`.card`)).forEach((card) => card.removeEventListener('click', holdCard));
    } else {
      // reset the game
      shuffledDeck = shuffle(deck);
      document.querySelectorAll('tr');
      Array.from(document.querySelectorAll('tr.winning_payout_row')).forEach((row) => row.classList.remove('winning_payout_row'));
      playButton.innerText = 'Draw';

      for(let i=0; i<HANDSIZE; i++) {
        document.getElementById(`card_${i}`).addEventListener('click', holdCard);
      }
    }
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
      let card_identifier = card.querySelector('.card_identifier');
      card_identifier.classList.add(color);
      let card_rank = card_identifier.querySelector('.card_rank');
      let card_suit = card_identifier.querySelector('.card_suit');
      card_rank.innerHTML = hand[i].rank_symbol;
      card_suit.innerHTML = hand[i].suit_symbol;

      let card_identifier_flipped = card.querySelector('.card_identifier-flipped');
      card_identifier_flipped.classList.add(color);
      let card_rank_flipped = card_identifier_flipped.querySelector('.card_rank');
      let card_suit_flipped = card_identifier_flipped.querySelector('.card_suit');
      card_rank_flipped.innerHTML = hand[i].rank_symbol;
      card_suit_flipped.innerHTML = hand[i].suit_symbol;

      card.classList.remove('holding');
    }
  }

  function holdCard(e) {
    let select_slot = this.getAttribute('id').slice(-1);

    if(!this.classList.contains('holding')) {
      this.classList.add('holding');
      hold[select_slot] = hand[select_slot];
    } else {
      this.classList.remove('holding');
      hold[select_slot] = '';
    }
  }

  document.getElementById(`button_draw`).addEventListener('click', (e) => {
    e.preventDefault;
    playRound();
  });

  function checkHand() {
    function orderRanks(){
      let orderedHand = hand.map((card) => {
        let orderedCard;
        switch(card.rank_symbol) {
          case 'A':
            orderedCard = 1
            break;
          case 'J':
            orderedCard = 11;
            break;
          case 'Q':
            orderedCard = 12;
            break;
          case 'K':
            orderedCard = 13;
            break
          default:
            orderedCard = parseInt(card.rank_symbol);
            break;
        }
        return orderedCard;
      });
  
      return orderedHand.sort((a, b) => a - b);
    }
    const isRoyal = () => {
      let isRoyal = true;
      let sorted_ranks = orderRanks();
      for(let i=0; i<sorted_ranks.length; i++) {
        if(sorted_ranks[i] > 1 && sorted_ranks[i] < 10) {
          isRoyal = false;
          break;
        }
      }
      return isRoyal;
    };
    const isFlush = () => {
      let unique_suits = hand.map((card) => card.suit);
      return [...new Set(unique_suits)].length == 1;
    }
    const isStraight = () => {
      let isStraight = true;
      let sorted_ranks = orderRanks();
      
      let index_value = sorted_ranks[0];
      for(let i=1; i<sorted_ranks.length; i++) {
        if((sorted_ranks[i]-index_value)==1) {
          index_value = sorted_ranks[i];
        } else {
          isStraight = false;
          break;
        }
      }
      return isStraight;
    };
    const uniqueRanks = () => {
      let hand_ranks = orderRanks(hand);
      return [...new Set(hand_ranks)].length;
    }
    const highestNumOfAKind = () => {
      let highestNumOfAKind = 0;
      let ranks = [];
      for(let i=0; i<hand.length; i++) {
        const rank = hand[i].rank;
        ranks[rank] = ranks[rank] ? ranks[rank]+1 : 1;
      }
      for(rank in ranks) {
        const rank_count = ranks[rank];
        if(rank_count > highestNumOfAKind) {
          highestNumOfAKind = rank_count;
        }
      }
      return highestNumOfAKind;
    }

    let handRank = 'No Payout';
    if(isRoyal() && isFlush()) {
      handRank = 'Royal Flush';
    } else if(isStraight() && isFlush()) {
      handRank = 'Straight Flush';
    } else if(highestNumOfAKind()==4) {
      handRank = 'Four of a Kind';
    } else if(highestNumOfAKind()==3 && uniqueRanks()==2) {
      handRank = 'Full House';
    } else if(isFlush()) {
      handRank = 'Flush';
    } else if(isStraight()) {
      handRank = 'Straight';
    } else if(highestNumOfAKind()==3 && uniqueRanks()==3) {
      handRank = 'Three of a Kind';
    } else if(highestNumOfAKind()==2 && uniqueRanks()==3) {
      handRank = 'Two Pair';
    } else if(uniqueRanks()==4) {
      handRank = 'Pair';
    }

    return handRank;
  }
}

gameloop();
