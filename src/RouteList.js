import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CharacterSelect from './CharacterSelect';
import GameBoard from './GameBoard';

function RouteList() {
  return (
    <div>
      <Routes>
        <Route path="/character-select" element={<CharacterSelect />} />
        <Route path="/game-board" element={<GameBoard />} />
      </Routes>
    </div>
  );
}

export default RouteList;
