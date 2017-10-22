import { observable } from 'mobx';

import { IBerry } from '../types';
import { Snake } from './Snake';
import { positionInDirection } from '../utils';


export class LongBerry implements IBerry {
  nutritionalValue = 0.5;
  color = '#5BBF54';
  @observable x: number;
  @observable y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  effect(snake: Snake) {
    snake.health = Math.min(snake.health + this.nutritionalValue, 1);
    snake.addToHead({ x: this.x, y: this.y });
  }
}


export class ShortBerry implements IBerry {
  nutritionalValue = 0.1;
  color = '#51B7F8';
  @observable x: number;
  @observable y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  effect(snake: Snake) {
    snake.health = Math.min(snake.health + this.nutritionalValue, 1);
    snake.removeFromTail();
  }
}