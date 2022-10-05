//store for a given game:
//4 players -- for each one:
//character, current coins, current stars, current items, current space, perhaps other stats for bonus stars?
//TODO: how to shift turns from one player to the next, how to represent different players' spaces on the board (probs with colors, or maybe putting their name after the space on the board)
//TODO: account for board events
//TODO: allow players to use items and factor those into the turn
//TODO: status of each piranha plant event (who owns it if anyone, is it stealing coins or stars)
//TODO: implement item shop; you pass it if you get to 30
//LATER GOAL: put in other boards?
//we are not gonna have triple dice cause it will make my life harder lol

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import './App.css';

function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event, R is red, W is Bowser, C is chance, V is VS

  const [diceRoll, setDiceRoll] = useState(0);
  const [spaces, setSpaces] = useState([]);
  const [bowserDetour, setBowserDetour] = useState([]);
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState({});
  const [player1Info, setPlayer1Info] = useState({});
  const [player2Info, setPlayer2Info] = useState({});
  const [player3Info, setPlayer3Info] = useState({});
  const [player4Info, setPlayer4Info] = useState({});
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
    }
    if (spaceArr[player.currentSpace.index] === 'W') {
      //lose 10 coins, bowser revolution (divide everyone's coins evenly), or lose 1 star
    }
    if (spaceArr[player.currentSpace.index] === 'C') {
      //choose random 1st player
      //choose random 2nd player
      //choose random event out of the following:
      //1 swaps coins with 2, 1 swaps stars with 2, and reverse
    }
    if (spaceArr[player.currentSpace.index] === 'V') {
      //current player gets 3 coins
      //randomly choose number of coins everyone has to give up out of 5, 10, 15, 20
      //use trivia question that can have 4 distinct scores to determine places
      //1st place gets 70% of the pot, 2nd place gets 20%, 3rd place gets 10%
    }
  }

  async function handleUpdate() {
    let updatedIndex = currentPlayerInfo.currentSpace.index + diceRoll;

    let updatedPlayer = {
      charName: currentPlayerInfo.charName,
      coins: currentPlayerInfo.coins,
      items: currentPlayerInfo.items,
      stars: currentPlayerInfo.stars,
      currentSpace: {
        bowserDetour: currentPlayerInfo.currentSpace.bowserDetour,
        index: updatedIndex,
      },
    };

    if (!currentPlayerInfo.currentSpace.bowserDetour) {
      if (updatedIndex >= 22 && updatedPlayer.coins >= 20) {
        updatedPlayer.coins -= 20;
        updatedPlayer.stars++;
      }

      if (currentPlayerInfo.currentSpace.index <= 32 && updatedIndex > 32) {
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

    setCurrentPlayerInfo(updatedPlayer);

    let currentBoard = updatedPlayer.currentSpace.bowserDetour
      ? bowserDetour
      : spaces;
    handleBoardEvent(updatedPlayer, currentBoard);

    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    // const gameDocSnap = await getDoc(gameDoc);

    if (currentPlayerInfo.charName === player4Info.charName) {
      setPlayer4Info(updatedPlayer);
      updateDoc(gameDoc, {
        char4: updatedPlayer,
      });
    } else if (currentPlayerInfo.charName === player3Info.charName) {
      setPlayer3Info(updatedPlayer);
      updateDoc(gameDoc, {
        char3: updatedPlayer,
      });
    } else if (currentPlayerInfo.charName === player2Info.charName) {
      setPlayer2Info(updatedPlayer);
      updateDoc(gameDoc, {
        char2: updatedPlayer,
      });
    } else {
      setPlayer1Info(updatedPlayer);
      updateDoc(gameDoc, {
        char1: updatedPlayer,
      });
    }
  }

  async function handleTurnChange() {
    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');
    const gameDocSnap = await getDoc(gameDoc);
    if (currentPlayerInfo.charName === gameDocSnap.data().char4.charName) {
      setCurrentPlayerInfo(gameDocSnap.data().char1);
    } else if (
      currentPlayerInfo.charName === gameDocSnap.data().char3.charName
    ) {
      setCurrentPlayerInfo(gameDocSnap.data().char4);
    } else if (
      currentPlayerInfo.charName === gameDocSnap.data().char2.charName
    ) {
      setCurrentPlayerInfo(gameDocSnap.data().char3);
    } else {
      setCurrentPlayerInfo(gameDocSnap.data().char2);
    }
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
      setPlayer1Info(gameDocSnap.data().char1);
      setPlayer2Info(gameDocSnap.data().char2);
      setPlayer3Info(gameDocSnap.data().char3);
      setPlayer4Info(gameDocSnap.data().char4);
      setCurrentPlayerInfo(gameDocSnap.data().char1);
    };
    getPlayerInfo();
  }, []);

  return (
    <div className="GameBoard">
      <h2>{currentPlayerInfo.charName}'s turn!</h2>
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
      <div>
        {spaces.map((space, idx) =>
          //   {
          //     if (
          //       idx === player1Info.currentSpace.index &&
          //       !player1Info.currentSpace.bowserDetour
          //     ) {
          //       return <strong className="player1">{`${space}    `}</strong>;
          //     } else if (
          //       idx === player2Info.currentSpace.index &&
          //       !player2Info.currentSpace.bowserDetour
          //     ) {
          //       return <strong className="player2">{`${space}    `}</strong>;
          //     } else if (
          //       idx === player3Info.currentSpace.index &&
          //       !player3Info.currentSpace.bowserDetour
          //     ) {
          //       return <strong className="player3">{`${space}    `}</strong>;
          //     } else if (
          //       idx === player4Info.currentSpace.index &&
          //       !player4Info.currentSpace.bowserDetour
          //     ) {
          //       return <strong className="player4">{`${space}    `}</strong>;
          //     } else {
          //       return <span>{`${space}    `}</span>;
          //     }
          //   }
          idx === currentPlayerInfo.currentSpace.index &&
          !currentPlayerInfo.currentSpace.bowserDetour ? (
            <strong>{`${space}    `}</strong>
          ) : (
            <span>{`${space}    `}</span>
          )
        )}
      </div>
      <div>
        {bowserDetour.map((space, idx) =>
          idx === currentPlayerInfo.currentSpace.index &&
          currentPlayerInfo.currentSpace.bowserDetour ? (
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
      <button type="button" onClick={handleTurnChange}>
        Change Turn
      </button>
    </div>
  );
}

export default GameBoard;
