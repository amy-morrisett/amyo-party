//TODO: make database (postgres or firestore?)
//store for a given game:
//4 players -- for each one:
//character, current coins, current stars, current items, current space, perhaps other stats for bonus stars?
//status of each piranha plant event (who owns it if anyone, is it stealing coins or stars)

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event, R is red, W is Bowser, C is chance, V is VS, S is star

  //after space 32, bowser flower lottery happens, if they "win" they go to the bowser detour spaces

  //after space 22, players can buy a star if they have enough coins
  const [diceRoll, setDiceRoll] = useState(0);
  const [spaces, setSpaces] = useState([]);
  const [bowserDetour, setBowserDetour] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [wonTheLottery, setWonTheLottery] = useState(true);

  async function handleDiceRoll() {
    setDiceRoll(Math.floor(Math.random() * 10) + 1);
  }

  function handleUpdate() {
    //const gameDocSnap = await getDoc(gameDoc);
    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    //console.log('playerInfo before roll', playerInfo);
    let updatedIndex = playerInfo.currentSpace.index + diceRoll;
    let updatedPlayer = {
      charName: playerInfo.charName,
      coins: playerInfo.coins,
      items: playerInfo.items,
      stars: playerInfo.stars,
      currentSpace: {
        bowserDetour: playerInfo.currentSpace.bowserDetour,
        index: updatedIndex,
      },
    };
    //console.log('updatedIndex', updatedIndex);
    if (!playerInfo.currentSpace.bowserDetour) {
      if (updatedIndex >= 22 && updatedPlayer.coins >= 20) {
        updatedPlayer.coins -= 20;
        updatedPlayer.stars++;
      }
      if (playerInfo.currentSpace.index <= 32 && updatedIndex > 32) {
        let winningTheLottery = Math.floor(Math.random() * 4);
        if (!winningTheLottery) {
          setWonTheLottery(false);
          updatedPlayer.currentSpace.bowserDetour = true;
          updatedPlayer.currentSpace.index -= 33;
          if (updatedPlayer.currentSpace.index >= 6) {
            updatedPlayer.coins >= 7
              ? (updatedPlayer.coins -= 7)
              : (updatedPlayer.coins = 0);
            const receiveSlowDice = Math.floor(Math.random() * 2);
            if (receiveSlowDice) updatedPlayer.items.push('slow dice');
          }
          if (updatedPlayer.currentSpace.index > 10) {
            setWonTheLottery(true);
            updatedPlayer.curentSpace.bowserDetour = false;
            updatedPlayer.currentSpace.index += 8;
          }
        } else if (updatedIndex > 41) {
          updatedPlayer.coins += 10;
          updatedPlayer.currentSpace.index -= 42;
        }
      }
      if (updatedIndex > 41) {
        updatedPlayer.coins += 10;
        updatedPlayer.currentSpace.index -= 42;
      }
    } else {
      if (updatedIndex >= 6) {
        updatedPlayer.coins >= 7
          ? (updatedPlayer.coins -= 7)
          : (updatedPlayer.coins = 0);
        const receiveSlowDice = Math.floor(Math.random() * 2);
        if (receiveSlowDice) updatedPlayer.items.push('slow dice');
      }
      if (updatedIndex > 10) {
        setWonTheLottery(true);
        updatedPlayer.currentSpace.bowserDetour = false;
        updatedPlayer.currentSpace.index += 8;
      }
    }
    setPlayerInfo(updatedPlayer);
    updateDoc(gameDoc, {
      char1: { updatedPlayer },
    });
    //if on normal board and player's index is currently 32 or less BUT diceRoll + player's index will be greater than 32, do the bowser lottery
    //for right now, 3/4 chance of flipping it to true
    //if it remains false, check if diceRoll + player's index will be greater than 41
    //if  so, go back around (i.e. if you were on 40 and roll a 2, go to zero)
    //if on bowser detour board and player's index is currently 10 or less BUT diceRoll + player's index will be greater than 10, make sure to set them back to the normal board (starting at space 19)

    //need to find out if player will lap around, pass a star, do the bowser lottery, get the extra coins for making it around, etc.
  }

  //   function displayBoard() {
  //     // handleUpdate();
  //     const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
  //     updateDoc(gameDoc, {
  //       char1: { playerInfo },
  //     });
  //   }

  useEffect(() => {
    const boardDoc = doc(db, 'party-info', 'boardLayouts');
    const getSpaceInfo = async () => {
      const boardDocSnap = await getDoc(boardDoc);
      setSpaces(boardDocSnap.data().spaces);
      setBowserDetour(boardDocSnap.data().bowserDetour);
    };
    getSpaceInfo();

    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    const getPlayerInfo = async () => {
      const gameDocSnap = await getDoc(gameDoc);
      setPlayerInfo(gameDocSnap.data().char1);
    };
    getPlayerInfo();
  }, []);

  return (
    <div className="GameBoard">
      <div>
        {spaces.map((space, idx) =>
          idx === playerInfo.currentSpace.index &&
          !playerInfo.currentSpace.bowserDetour ? (
            <strong>{`${space}    `}</strong>
          ) : (
            <span>{`${space}    `}</span>
          )
        )}
      </div>
      <div>
        {bowserDetour.map((space, idx) =>
          idx === playerInfo.currentSpace.index &&
          playerInfo.currentSpace.bowserDetour ? (
            <strong>{`${space}    `}</strong>
          ) : (
            <span>{`${space}    `}</span>
          )
        )}
      </div>
      <button type="button" onClick={handleDiceRoll}>
        Roll Dice
        {/* {console.log(spaces.indexOf('KE'))} */}
      </button>
      <p>{diceRoll ? `You rolled a(n) ${diceRoll}!` : 'Roll the dice!'}</p>
      <button type="button" onClick={handleUpdate}>
        Move
      </button>
      <p>{wonTheLottery ? '' : 'Oh no, you lost the Bowser lottery!'}</p>
    </div>
  );
}

export default GameBoard;
