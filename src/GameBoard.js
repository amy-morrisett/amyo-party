//TODO: make database (postgres or firestore?)
//store for a given game:
//4 players -- for each one:
//character, current coins, current stars, current items, perhaps other stats for bonus stars?
//status of each piranha plant event (who owns it if anyone, is it stealing coins or stars)

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc } from 'firebase/firestore';

function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event R is red, W is Bowser, C is chance, V is VS, S is star

  //after space 32, bowser flower lottery happens, if they "win" they go to the bowser detour spaces

  //after space 22, players can buy a star if they have enough coins
  const [diceRoll, setDiceRoll] = useState(0);
  const [testingChar, setTestingChar] = useState('');
  const spaces = [
    'L',
    'B',
    'CE',
    'CE',
    'B',
    'R',
    'CE',
    'CE',
    'B',
    'L',
    'B',
    'CE',
    'CE',
    'B',
    'B',
    'CE',
    'CE',
    'B',
    'L',
    'L',
    'B',
    'B',
    'B',
    'B',
    'B',
    'B',
    'L',
    'B',
    'KE',
    'B',
    'B',
    'R',
    'L',
    'B',
    'L',
    'V',
    'B',
    'CE',
    'CE',
    'R',
    'C',
    'W',
  ];
  const bowserDetourSpaces = [
    'R',
    'R',
    'R',
    'B',
    'L',
    'B',
    'B',
    'L',
    'V',
    'C',
    'W',
  ];
  useEffect(() => {
    const playerDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    const getCharName = async () => {
      const playerDocSnap = await getDoc(playerDoc);
      setTestingChar(playerDocSnap.data().char1.charName);
    };
    getCharName();
  }, []);
  return (
    <div className="GameBoard">
      <h1>{testingChar}</h1>
      <div>
        {spaces.map((space) => (
          <span>{`${space}    `}</span>
        ))}
      </div>
      <div>
        {bowserDetourSpaces.map((space) => (
          <span>{`${space}    `}</span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setDiceRoll(Math.floor(Math.random() * 10) + 1)}
      >
        Roll Dice
        {console.log(spaces.indexOf('KE'))}
      </button>
      <p>{diceRoll ? diceRoll : 'Roll the dice to see how far you will go!'}</p>
    </div>
  );
}

export default GameBoard;
