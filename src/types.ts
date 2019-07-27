import Snake from "./models/Snake";

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ILevel {
  width: number;
  height: number;
  blockGrid: string;
}

export interface IBerry extends IPosition {
  nutritionalValue: number;
  color: string;
  effect(snake: Snake): void;
}

export interface IDna {
  snakeAttraction: number;
  longberryAttraction: number;
  shortberryAttraction: number;
  deathberryAttraction: number;
  eggRate: number;
}

export interface IEgg extends IPosition {
  health: number;
  dna: IDna;
}
