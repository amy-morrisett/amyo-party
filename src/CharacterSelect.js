import React, { useState } from 'react';

function CharacterSelect() {
  const [character, setCharacter] = useState('');
  const [CPUArr, setCPUArr] = useState([]);
  const charArr = [
    'Peach',
    'Daisy',
    'Rosalina',
    'Birdo',
    'Pauline',
    'Wendy',
    'Waluigi',
    'Toadette',
  ];
  function pickCPUs(selectedChar, charArr) {
    let playerArr = [selectedChar];
    for (let i = 0; i < 3; i++) {
      let randomIdx = Math.floor(Math.random() * charArr.length);
      while (playerArr.includes(charArr[randomIdx])) {
        randomIdx = Math.floor(Math.random() * charArr.length);
      }
      playerArr.push(charArr[randomIdx]);
    }
    return playerArr.slice(1);
  }

  return (
    <div className="CharacterSelect">
      <ul>
        <li>
          <button type="button" onClick={() => setCharacter('Peach')}>
            Peach
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Daisy')}>
            Daisy
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Rosalina')}>
            Rosalina
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Birdo')}>
            Birdo
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Pauline')}>
            Pauline
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Wendy')}>
            Wendy
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Waluigi')}>
            Waluigi
          </button>
        </li>
        <li>
          <button type="button" onClick={() => setCharacter('Toadette')}>
            Toadette
          </button>
        </li>
        <button
          type="button"
          onClick={() => setCPUArr(pickCPUs(character, charArr))}
        >
          Get Opponents
        </button>
      </ul>
      <p>Selected Character: {character}</p>
      <p>Opponents: </p>
      <ul>
        {CPUArr.map((CPU) => (
          <li>{CPU}</li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterSelect;
