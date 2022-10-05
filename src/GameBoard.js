//store for a given game:
//4 players -- for each one:
//character, current coins, current stars, current items, current space, perhaps other stats for bonus stars?
//TODO: how to shift turns from one player to the next, how to represent different players' spaces on the board (probs with colors, or maybe putting their name after the space on the board)
//TODO: account for board events
//TODO: allow players to use items and factor those into the turn
//TODO: status of each piranha plant event (who owns it if anyone, is it stealing coins or stars)
//TODO: implement item shop
//LATER GOAL: put in other boards?
//we are not gonna have triple dice cause it will make my life harder lol

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event, R is red, W is Bowser, C is chance, V is VS

  const [diceRoll, setDiceRoll] = useState(0);
  const [spaces, setSpaces] = useState([]);
  const [bowserDetour, setBowserDetour] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [wonTheLottery, setWonTheLottery] = useState(true);

  function handleDiceRoll() {
    setDiceRoll(Math.floor(Math.random() * 10) + 1);
  }

  async function handleBoardEvent(player, spaceArr) {
    // const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    // const gameDocSnap = await getDoc(gameDoc);
    if (spaceArr[player.currentSpace.index] === 'B') {
      player.coins += 3;
    }
    if (spaceArr[player.currentSpace.index] === 'R') {
      player.coins -= 3;
    }
    if (spaceArr[player.currentSpace.index] === 'KE') {
      player.currentSpace.index = 40;
      alert('You skipped some spaces!');
    }
    // if (spaceArr[player.currentSpace.index] === 'CE') {
    //     if (player.currentSpace.index === 2 || player.currentSpace.index === 3) {
    //         let canUpgrade = gameDocSnap.data().p1.currentOwner ? true : false
    //         updateDoc(gameDoc, {
    //             p1: { currentOwner: player.charName, type:  },
    //           });
    //     }
    //   }

    if (spaceArr[player.currentSpace.index] === 'L') {
      let randomChoice = Math.floor(Math.random() * 3);
      if (randomChoice === 0) {
        player.coins += 10;
      }
      if (randomChoice === 1) {
        player.coins += 15;
      }
      //   let randomChoice = 2;
      if (randomChoice === 2) {
        const itemDoc = doc(db, 'party-info', 'itemPrices');
        const itemDocSnap = await getDoc(itemDoc);
        const itemArr = Object.keys(itemDocSnap.data());
        player.items.push(itemArr[Math.floor(Math.random() * itemArr.length)]);
        //TODO: right now this doesn't update until the next time we roll the dice & move
      }
      //options: get 10 coins, get 15 coins, get random item
    }
  }

  function handleUpdate() {
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

    let currentBoard = updatedPlayer.currentSpace.bowserDetour
      ? bowserDetour
      : spaces;
    handleBoardEvent(updatedPlayer, currentBoard);

    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    updateDoc(gameDoc, {
      char1: { updatedPlayer },
    });
  }

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
        <h3>{playerInfo.charName} Info</h3>
        <div>Coins: {playerInfo.coins}</div>
        <div>Stars: {playerInfo.stars}</div>
        <div>
          Items:{' '}
          {playerInfo.items
            ? playerInfo.items.map((item) => <span>{item}, </span>)
            : ''}
        </div>
      </div>
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
