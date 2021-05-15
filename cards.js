const DECKSIZE = 52;
const SUITSIZE = 13;

class Card {
  constructor(id, suit, rank) {
    this.id = id;
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
    deck.push(card);
    
    if(rankIndex < SUITSIZE-1) {
      rankIndex++;
    } else {
      suitIndex++;
      rankIndex = 0;
    }
  }

  return deck;
}

let deck = generateDeck()