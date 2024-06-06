export class CreateNodeDto {
  name: string;
  description: string;
  type: string[];
  effect_on_char: string[];
}

export type UpgradeStat = {
  type: string;
  value: number;
};

// effect on char will have 3 types, DEF, STR, MANA, followed by a # number
// example: DEF#2, STR#1, MANA#3
