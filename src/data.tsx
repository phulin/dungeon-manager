export type DungeonType = 'Hobopolis' | 'The Slime Tube' | 'Dreadsylvania';
export const allDungeonTypes: DungeonType[] = ['Hobopolis', 'The Slime Tube', 'Dreadsylvania'];

export interface Player {
  id: number;
  name: string | null;
  adventures: number | null;
  class: string | null;
}

export interface DungeonItem {
  id: number;
  descid: number | null;
  imageUrl: string | null;
  name: string | null;
  acquirer: string;
  canDistro: boolean;
  eligible: Player[];
}

export interface Dungeon {
  type: DungeonType;
  items: DungeonItem[];
}
