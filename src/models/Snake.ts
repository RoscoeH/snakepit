import { observable, computed, action } from 'mobx'
import { IPosition, IDna, Direction } from '../types'

import { randomFromInterval, positionInDirection } from '../utils'
import { Pit } from './Pit';



export class Snake {
  dna: IDna;
  @observable segments: Array<IPosition> = [];
  @observable health = 1;

  constructor (public id: number, private pit: Pit, positions: Array<IPosition>) {
    positions.forEach(position => this.addToTail(position));

    this.dna = {
      snakeAttraction: randomFromInterval(-1, 1),
      longberryAttraction: randomFromInterval(-1, 1)
    };
  }

  @computed get head (): IPosition {
    return (this.segments.length > 0) ? this.segments[0] : null
  }

  @computed get direction (): Direction {
    if (this.segments.length > 1) {
      const segmentBeforeHead = this.segments[1]
      const xDiff = this.head.x - segmentBeforeHead.x
      const yDiff = this.head.y - segmentBeforeHead.y

      if (xDiff < 0) {
        return Direction.WEST
      } else if (xDiff > 0) {
        return Direction.EAST
      } else if (yDiff < 0) {
        return Direction.NORTH
      } else if (yDiff > 0) {
        return Direction.SOUTH
      }
    } else {
      return null
    }
  }

  @computed get outOfBounds (): boolean {
    return this.segments.every((segment: IPosition) => (
      (segment.x < 0 || segment.x > (this.pit.width - 1)) ||
      (segment.y < 0 || segment.y > (this.pit.height - 1))
    ))
  }

  @action addToHead (segmentPosition: IPosition): Snake {
    this.segments.unshift(segmentPosition)
    return this
  }

  @action addToTail (segmentPosition: IPosition): Snake {
    this.segments.push(segmentPosition)
    return this
  }

  @action removeFromTail (): Snake {
    if (this.segments.length > 1) {
      this.segments.pop()
    }
    return this
  }

  @action move (direction: Direction): void {
    const position = positionInDirection(this.head, direction)
    this.segments = this.segments.map((segment, index) => {
      return (index === 0)
        ? { ...segment, ...position }
        : { ...segment, x: this.segments[index - 1].x, y: this.segments[index - 1].y }
    })
  }

}

