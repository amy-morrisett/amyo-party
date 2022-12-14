import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc } from 'firebase/firestore';
import './App.css';

function PlayerStats() {
  const [player1Info, setPlayer1Info] = useState({});
  const [player2Info, setPlayer2Info] = useState({});
  const [player3Info, setPlayer3Info] = useState({});
  const [player4Info, setPlayer4Info] = useState({});

  useEffect(() => {
    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    const getPlayerInfo = async () => {
      const gameDocSnap = await getDoc(gameDoc);
      setPlayer1Info(gameDocSnap.data().char1);
      setPlayer2Info(gameDocSnap.data().char2);
      setPlayer3Info(gameDocSnap.data().char3);
      setPlayer4Info(gameDocSnap.data().char4);
    };
    getPlayerInfo();
  }, [player1Info, player2Info, player3Info, player4Info]);
  //TODO -- IMPORTANT!!! : this dependency array is making my reads really high...

  // function determineRankings() {
  //   const playerArr = [player1Info, player2Info, player3Info, player4Info]
  //   let first = player1Info
  //   let second
  //   let third
  //   let fourth
  //   for (let i = 0; i < playerArr.length; i++) {

  //   }
  // }

  return (
    <div className="PlayerStats">
      <div>
        <h3>{player1Info.charName} Info</h3>
        <div></div>
        <div>Coins: {player1Info.coins}</div>
        <div>Stars: {player1Info.stars}</div>
        <div>
          Items:{' '}
          {player1Info.items
            ? player1Info.items.map((item) => <span>{item}, </span>)
            : ''}
        </div>
      </div>
      <div>
        <h3>{player2Info.charName} Info</h3>
        <div>Coins: {player2Info.coins}</div>
        <div>Stars: {player2Info.stars}</div>
        <div>
          Items:{' '}
          {player2Info.items
            ? player2Info.items.map((item) => <span>{item}, </span>)
            : ''}
        </div>
      </div>
      <div>
        <h3>{player3Info.charName} Info</h3>
        <div>Coins: {player3Info.coins}</div>
        <div>Stars: {player3Info.stars}</div>
        <div>
          Items:{' '}
          {player3Info.items
            ? player3Info.items.map((item) => <span>{item}, </span>)
            : ''}
        </div>
      </div>
      <div>
        <h3>{player4Info.charName} Info</h3>
        <div>Coins: {player4Info.coins}</div>
        <div>Stars: {player4Info.stars}</div>
        <div>
          Items:{' '}
          {player4Info.items
            ? player4Info.items.map((item) => <span>{item}, </span>)
            : ''}
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;
