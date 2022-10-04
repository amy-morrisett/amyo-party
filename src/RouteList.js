import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CharacterSelect from './CharacterSelect';
import GameBoard from './GameBoard';

function RouteList() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CharacterSelect />} />
        <Route path="/game-board" element={<GameBoard />} />
      </Routes>
    </div>
  );
}

export default RouteList;
