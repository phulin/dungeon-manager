import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import cheerio from 'cheerio';
import { print, visitUrl, write } from 'kolmafia';

import App from './App';
import { allDungeonTypes, DungeonItem, DungeonType } from './data';
import { itemDungeonTypeMap } from './items';

/*
export interface Player {
  id: number;
  name: string;
  adventures: number;
  class: string;
}

export interface DungeonItem {
  id: number;
  descid: number;
  name: string;
  imageUrl: string;
  acquirer: string;
  canDistro: boolean;
  eligible: Player[];
}

export interface Dungeon {
  name: string;
  items: [DungeonItem];
}
*/

Object.defineProperty(this, 'console', {
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(...args: any[]) {
      print(args.map(x => x.toString()).join(' '));
    },
  },
});

function eligiblePlayers($: cheerio.Root, menu: cheerio.Cheerio) {
  return menu
    .children("option[value!='0']")
    .toArray()
    .map(element => {
      const option = $(element);
      const content = option.text();
      const match = content.match(/(.*?)\s+\((\d+) Adv.\)\s+\[([A-Z]+)\]/);
      const idString = option.attr('value');
      return {
        id: idString ? parseInt(idString, 10) : -1,
        name: match ? match[1] : null,
        adventures: match ? parseInt(match[2], 10) : null,
        class: match ? match[3] : null,
      };
    });
}

function dungeonItem($: cheerio.Root, row: cheerio.Cheerio): DungeonItem {
  const cells = row.find('td');
  const imgCell = cells.first();
  const img = imgCell.find('img');
  const descidAttr = img.attr('onclick');
  const descidMatch = descidAttr ? descidAttr.match(/descitem\(([0-9]+)\)/) : null;
  const descid = descidMatch ? parseInt(descidMatch[1], 10) : null;
  const nameCell = imgCell.next();
  const acquirerCell = nameCell.next();
  const eligibleCell = acquirerCell.next().next();
  const idString = eligibleCell.find("input[name='whichloot']").attr('value');
  return {
    id: idString ? parseInt(idString, 10) : -1,
    descid,
    name: nameCell.find('b').text(),
    imageUrl: img.attr('src') || null,
    acquirer: acquirerCell.text().replace('Acquired by: ', '').trim(),
    canDistro: row.find("input[value='Give Loot!']").length > 0,
    eligible: eligiblePlayers($, eligibleCell.find("select[name='recipient']")),
  };
}

export function main() {
  const page = visitUrl();
  const $ = cheerio.load(page);

  const titles = allDungeonTypes as string[];
  const titleCells = $("td[bgcolor='blue'] b").filter((index, element) => titles.includes($(element).text()));
  const openDungeons = titleCells.toArray().map(element => $(element).text()) as DungeonType[];

  const lootTable = $('p')
    .filter((index, element) => $(element).text().includes('Undistributed loot:'))
    .find('table');
  const allLootData = lootTable
    .find('tr')
    .toArray()
    .map(element => dungeonItem($, $(element)));

  const presentDungeons = new Set<DungeonType>([
    ...openDungeons,
    ...(allLootData
      .map(({ name }) => itemDungeonTypeMap.get(Item.get(name ?? 'none')))
      .filter(type => type !== undefined) as DungeonType[]),
  ]);

  const data = {
    dungeons: [...presentDungeons].map(type => ({
      type,
      items: allLootData.filter(({ name }) => type === itemDungeonTypeMap.get(Item.get(name ?? 'none'))),
    })),
  };

  titleCells.closest('table').remove();
  lootTable.closest('p').remove();

  const appString = renderToString(createElement(App, data));
  $("img[name='wholebasement9']").closest('table').after(appString);
  write($.html());
}
