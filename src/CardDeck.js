import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CardDeck.css';

const CardDeck = ({deckNumber=1}) => {
const [deckId, setDeckId ]= useState(deckNumber);
const [remainedCard, setRemainedCard ] = useState(null);
const [cards, setCards] = useState([]);
const [isDrawing, setIsDrawing] = useState(false);
const timerId = useRef();

const toggleClick = () => {
  if(remainedCard !== 0){
    setIsDrawing(!isDrawing);
  }
};

useEffect(()=> {
  timerId.current = setInterval(async() => {
    try {
      if(remainedCard !== 0 && isDrawing){
          const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
          if (res.data.success) {
            const card = res.data.cards[0];
            const cardSrc = card.image;
            const angle = Math.random() * 90 - 45;
            const randomX = Math.random() * 40 - 20;
            const randomY = Math.random() * 40 - 20;
            setCards((prevCards) => [
              ...prevCards,
              {
                src: cardSrc,
                transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`,
              },
            ]);
            setRemainedCard(res.data.remaining);
           }
    
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  }, 1000);

  return () => {
    if(isDrawing){
      clearInterval(timerId.current);
    }
  }
}, [isDrawing]);


useEffect(() => {
    const initDeck = async () => {
        try {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckNumber}`);
            if(res.data.success){
                setDeckId(res.data.deck_id);
                setRemainedCard(res.data.remaining);
                setCards([]);
            }
        } catch (error) {
            console.error('Error init deck:', error);
        }

    };
    initDeck();
},[deckNumber]);

const handleClick = async () => {
    try {
      if(remainedCard !== 0){
          const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
          if (res.data.success) {
            const card = res.data.cards[0];
            const cardSrc = card.image;
            const angle = Math.random() * 90 - 45;
            const randomX = Math.random() * 40 - 20;
            const randomY = Math.random() * 40 - 20;
            setCards((prevCards) => [
              ...prevCards,
              {
                src: cardSrc,
                transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`,
              },
            ]);
            setRemainedCard(res.data.remaining);
      }
    
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  };

    return(
        <div className='CardDeck-center'>
            <button onClick={toggleClick} className='CardDeck-btn'>{isDrawing?"Stop drawing":"Start drawing"}</button>
            <p>Remaining card: <span className='warning'>{ remainedCard }</span></p>
            <div className='CardDeck'>
                {cards.map((card, index) => (
                <img
                    className='img'
                    key={index}
                    src={card.src}
                    style={{ transform: card.transform }}
                    alt="card"
                />
                ))}
            </div>
            {remainedCard === 0 && <p className='error'>No more cards remaining.</p>}
        </div>
    )

}
export default CardDeck;