import { Snake } from './models/snake';

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

export interface IPosition {
  x: number,
  y: number
}

export interface ILevel {
  width: number;
  height: number;
  blockGrid: string;
}

export interface IBerry extends IPosition {
  nutritionalValue: number;
  color: string,
  effect(snake: Snake): void;
}