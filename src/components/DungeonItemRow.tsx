import React from 'react';
import { DungeonItem, Player } from '../data';

const DungeonItemRow = ({ item, allUsers }: { item: DungeonItem; allUsers: Player[] }) => (
  <tr>
    <td>
      {/* cursor pointer, valign middle */}
      {/* eslint-disable-next-line no-undef */}
      <img src={item.imageUrl ?? undefined} onClick={item.descid !== null ? () => descitem(item.descid!) : undefined} />
    </td>
    <td>{item.name}</td>
    {allUsers.map(player => (
      <td key={player.id}>x</td>
    ))}
  </tr>
);

export default DungeonItemRow;
