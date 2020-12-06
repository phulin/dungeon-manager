import React from 'react';

import DungeonManager from './components/DungeonManager';
import { Dungeon } from './data';

const App = ({ dungeons }: { dungeons: Dungeon[] }) => {
  return (
    <div id="react-root">
      <DungeonManager dungeons={dungeons} />
    </div>
  );
};

export default App;
