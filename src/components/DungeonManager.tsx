import React from 'react';
import DungeonDisplay from './DungeonDisplay';
import { Dungeon } from '../data';

const DungeonManager = ({ dungeons }: { dungeons: Dungeon[] }) => (
  <>
    <h2>Dungeon Manager</h2>
    {dungeons.map(dungeon => (
      <DungeonDisplay key={dungeon.type} dungeon={dungeon} />
    ))}
  </>
);

export default DungeonManager;
