import React from 'react';
import DungeonItemRow from './DungeonItemRow';
import { Dungeon, DungeonItem, Player } from '../data';

const DungeonDisplay = ({ dungeon: { type, items } }: { dungeon: Dungeon }) => {
  let allUsersPre: Player[] = [];
  allUsersPre = allUsersPre.concat(...items.map(({ eligible }: DungeonItem) => eligible));
  const allUsersDeduped = new Map<number, Player>(allUsersPre.map((user: Player) => [user.id, user]));
  const allUsers = [...allUsersDeduped.values()].sort(
    (a: Player, b: Player) => (b.adventures ?? 0) - (a.adventures ?? 0)
  );
  return (
    <>
      <h3>{type}</h3>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Name</th>
              {allUsers.map(({ id, name }) => (
                <th key={id}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <DungeonItemRow key={item.id} item={item} allUsers={allUsers} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items to distribute.</p>
      )}
    </>
  );
};

export default DungeonDisplay;
