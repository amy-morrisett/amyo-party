//store for a given game:
//4 players -- for each one:
//character, current coins, current stars, current items, current space, perhaps other stats for bonus stars?
//TODO: how to represent different players' spaces on the board (probs with colors, or maybe putting their name after the space on the board)
//TODO: account for board events
//TODO: allow players to use items and factor those into the turn
//TODO: status of each piranha plant event (who owns it if anyone, is it stealing coins or stars)
//TODO: display who is in 1st, 2nd, 3rd, 4th place?
//TODO: add last 5 turns event where someone gets a helping hand?
//LATER GOAL: put in other boards?
//we are not gonna have triple dice cause it will make my life harder lol

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import PlayerStats from './PlayerStats.js';
import './App.css';

function GameBoard() {
  //L is lucky, B is blue, CE is coin piranha event, SE is star piranha event, KE is skip event, R is red, W is Bowser, C is chance, V is VS

  const [diceRoll, setDiceRoll] = useState(0);
  const [spaces, setSpaces] = useState([]);
  const [bowserDetour, setBowserDetour] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState({});
  const [player1Info, setPlayer1Info] = useState({});
  const [player2Info, setPlayer2Info] = useState({});
  const [player3Info, setPlayer3Info] = useState({});
  const [player4Info, setPlayer4Info] = useState({});
  const [wonTheLottery, setWonTheLottery] = useState(true);
  const [seeItemShop, setSeeItemShop] = useState(false);

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
      player.coins >= 3 ? (player.coins -= 3) : (player.coins = 0);
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
      if (randomChoice === 2) {
        const itemArr = Object.keys(itemList);
        player.items.push(itemArr[Math.floor(Math.random() * itemArr.length)]);
        //TODO: not sure if this is updating the PlayerStats display correctly
      }
    }
    if (spaceArr[player.currentSpace.index] === 'W') {
      let randomChoice = Math.floor(Math.random() * 3);
      if (randomChoice === 0) {
        player.coins >= 10 ? (player.coins -= 10) : (player.coins = 0);
      }
      if (randomChoice === 1) {
        let totalCoins =
          player1Info.coins +
          player2Info.coins +
          player3Info.coins +
          player4Info.coins;
        let newCoins = Math.floor(totalCoins / 4);
        player.coins = newCoins;
        //TODO: need to make sure everyone else's coins are also changed to this
      }
      if (randomChoice === 2) {
        if (player.stars) player.stars--;
      }
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

      if (updatedIndex >= 30) {
        setSeeItemShop(true);
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

  async function handleItemPurchase(item, cost) {
    const gameDoc = doc(db, 'games', 'pmX2c0bJU9JNpY5wb4ZR');

    let updatedPlayer = {
      charName: currentPlayerInfo.charName,
      coins: currentPlayerInfo.coins - cost,
      items: currentPlayerInfo.items,
      stars: currentPlayerInfo.stars,
      currentSpace: {
        bowserDetour: currentPlayerInfo.currentSpace.bowserDetour,
        index: currentPlayerInfo.currentSpace.index,
      },
    };

    if (updatedPlayer.coins < 0) {
      alert('Sorry, you do not have enough coins!');
    } else {
      updatedPlayer.items.push(item);

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
    setSeeItemShop(false);
  }

  useEffect(() => {
    const boardDoc = doc(db, 'party-info', 'boardLayouts');
    const getSpaceInfo = async () => {
      const boardDocSnap = await getDoc(boardDoc);
      setSpaces(boardDocSnap.data().spaces);
      setBowserDetour(boardDocSnap.data().bowserDetour);
    };
    getSpaceInfo();

    const itemDoc = doc(db, 'party-info', 'itemPrices');
    const getItemInfo = async () => {
      const itemDocSnap = await getDoc(itemDoc);
      setItemList(itemDocSnap.data());
    };
    getItemInfo();

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

      <PlayerStats />

      <div>
        {spaces.map((space, idx) =>
          //TODO: show where ALL players are on the board -- code below doesn't account for multiple players on the same space
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

      <div>
        {seeItemShop ? (
          <div>
            'Would you like to buy an item?'{' '}
            <ul>
              {Object.keys(itemList).map((item) => (
                <li>
                  {item}: {itemList[item]} coins
                  <button
                    type="button"
                    onClick={() => handleItemPurchase(item, itemList[item])}
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ''
        )}
      </div>

      <button type="button" onClick={handleTurnChange}>
        Change Turn
      </button>
    </div>
  );
}

export default GameBoard;
