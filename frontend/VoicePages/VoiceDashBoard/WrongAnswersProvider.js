// WrongAnswersProvider.js
import React, { createContext, useState, useContext } from 'react';

const WrongAnswersContext = createContext();

export const WrongAnswersProvider = ({ children }) => {
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null); // Store the date and time of the last update

  const addWrongAnswer = (answer) => {
    setWrongAnswers(prevAnswers => [...prevAnswers, answer]);
    setLastUpdate(new Date()); // Update the last update date and time
  };

  return (
    <WrongAnswersContext.Provider value={{ wrongAnswers, addWrongAnswer, lastUpdate }}>
      {children}
    </WrongAnswersContext.Provider>
  );
};

export const useWrongAnswers = () => useContext(WrongAnswersContext);
