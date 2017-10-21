import { observable } from 'mobx';

import { IBerry } from '../types';
import { Snake } from './Snake';
import { positionInDirection } from '../utils';


export class LongBerry implements IBerry {
  nutritionalValue = 0.5
  color = '#5BBF54';
  @observable x: number;
  @observable y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  effect(snake: Snake) {
    snake.health += this.nutritionalValue;
    snake.addToHead(positionInDirection(snake.head, snake.direction));
  }
}