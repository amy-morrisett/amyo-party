import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function CharacterSelect() {
  const [character, setCharacter] = useState('');
  const [charArr, setCharArr] = useState([]);
  const [CPUArr, setCPUArr] = useState([]);

  function pickCPUs(selectedChar, charArr) {
    let playerArr = [selectedChar];
    for (let i = 0; i < 3; i++) {
      let randomIdx = Math.floor(Math.random() * charArr.length);
      while (playerArr.includes(charArr[randomIdx])) {
        randomIdx = Math.floor(Math.random() * charArr.length);
      }
      playerArr.push(charArr[randomIdx]);
    }

    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    updateDoc(gameDoc, {
      char1: {
        charName: selectedChar,
        coins: 10,
        items: [],
        stars: 0,
        currentSpace: { bowserDetour: false, index: 0 },
      },
      char2: {
        charName: playerArr[1],
        coins: 10,
        items: [],
        stars: 0,
        currentSpace: { bowserDetour: false, index: 0 },
      },
      char3: {
        charName: playerArr[2],
        coins: 10,
        items: [],
        stars: 0,
        currentSpace: { bowserDetour: false, index: 0 },
      },
      char4: {
        charName: playerArr[3],
        coins: 10,
        items: [],
        stars: 0,
        currentSpace: { bowserDetour: false, index: 0 },
      },
    });
    playerArr = playerArr.slice(1);
    setCPUArr(playerArr);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
  }

  function handleChange(evt) {
    setCharacter(evt.target.value);
  }

  useEffect(() => {
    const playableCharsDoc = doc(db, 'party-info', 'playableCharacters');
    const getCharArr = async () => {
      const charDocSnap = await getDoc(playableCharsDoc);
      setCharArr(charDocSnap.data().names);
    };
    getCharArr();
  }, []);

  return (
    <div className="CharacterSelect">
      <h1>It's-a me, Amyo!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select your character:
          <select value={character} onChange={handleChange}>
            <option value="" disabled selected>
              Select your option
            </option>
            <option value="Peach">Peach</option>
            <option value="Daisy">Daisy</option>
            <option value="Rosalina">Rosalina</option>
            <option value="Pauline">Pauline</option>
            <option value="Wendy">Wendy</option>
            <option value="Birdo">Birdo</option>
            <option value="Waluigi">Waluigi</option>
            <option value="Toadette">Toadette</option>
          </select>
        </label>
        {/* <input type="submit" value="Submit" /> */}
      </form>
      <button type="button" onClick={() => pickCPUs(character, charArr)}>
        Get Opponents
      </button>
      <p>Opponents: </p>
      <ul>
        {CPUArr.map((CPU) => (
          <li>{CPU}</li>
        ))}
      </ul>
      <Link to="/game-board">Game Board</Link>
    </div>
  );
}

export default CharacterSelect;
