// PriorityCards.js
import React from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import styles from '/styles/prioritycard.module.css';

const PriorityCards = ({
  priority,
  priorityCard,
  setpriorityCard,
  updateLabel,
  selectedCard,
  setSelectedCard,
}) => {
  const socket = io('http://localhost:5050', { transports: ['websocket'] });

  socket.on('call progress event', (call) => {
    console.log('Call progress event received:', call);
    const newCard = {
      id: call.id,
      inProgress: call.inProgress,
      name: call.name,
      number: call.number,
      emergency: call.emergency,
      location: call.location,
      status: 'open',
      transcript: call.transcript,
      priority: 0,
    };

    setpriorityCard((prevCards) => {
      const existingIndex = prevCards.findIndex((card) => card.id === newCard.id);
      if (existingIndex === -1) {
        return [...prevCards, newCard];
      } else {
        const updatedCards = [...prevCards];
        updatedCards[existingIndex] = newCard;
        return updatedCards;
      }
    });
  });

  const addNewLines = (text) => text.split('\n').map((line, index) => <p key={index}>{line}</p>);

  return (
    <div>
      <h3 className={styles.priorityheader}>Level {priority} Priority</h3>
      {priorityCard.map((card) => (
        (priority == card.priority || (priority === 'Incoming' && card.priority === 0)) &&
        (card.id === selectedCard ? (
          <div key={card.id} className={styles.cardactive}>
            <motion.img
              className={styles.exit}
              onClick={() => setSelectedCard('')}
              src="/cross.png"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.5 }}
            />
            <div className={styles.cardheader}>
              <h1 className={styles.cardtitle}>{card.emergency}</h1>
            </div>
            <div className={styles.cardcontent}>
              <div className={styles.priority}>
                <h3>Priority</h3>
                <select value={card.priority} onChange={updateLabel} className={styles.priorityselect}>
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.calldata}>
                <h3>Phone Number: <span>{card.number}</span></h3>
                <h3>Status: <span>{card.status}</span></h3>
                <h3>Name: <span>{card.name}</span></h3>
                <h3>Location: <span>{card.location}</span></h3>
              </div>
              <div className={styles.log}>
                <h2>Log</h2>
                <div className={styles.line} />
                <div className={styles.logbody}>{addNewLines(card.transcript)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div key={card.id} onClick={() => setSelectedCard(card.id)} className={styles.cardclosed}>
            <h3 className={styles.cardClosedHeader}>{card.emergency}</h3>
            <div className={styles.cardClosedDesc}>
              <h3>{card.status}</h3>
              <h3>{card.location}</h3>
            </div>
          </div>
        ))
      ))}
    </div>
  );
};

export default PriorityCards;
