import { computed } from 'mobx';

import { ILevel, IPosition } from '../types';

export class Pit {
  cellSize = 64;
  cellHeight = 16;
  width: number = 20;
  height: number = 20;
  blockGrid: string = '';

  constructor(level: ILevel) {
    this.parseLevel(level);
  }

  @computed get canvasWidth(): number {
    return this.width * this.cellSize;
  }

  @computed get canvasHeight(): number {
    return this.height * this.cellSize;
  }

  @computed get blocks (): Array<IPosition> {
    const blocks: Array<IPosition> = []
    const rows = this.blockGrid.split('\n')

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      for (let j = 0; j < row.length; j++) {
        if (row[j] === '#') {
          blocks.push({
            x: j,
            y: i
          })
        }
      }
    }

    return blocks
  }

  blockAt(position: IPosition): boolean {
    return this.blockGrid.split('\n')[position.y][position.x] === '#';
  }

  parseLevel(level: ILevel) {
    this.width = level.width;
    this.height = level.height;
    this.blockGrid = level.blockGrid;
  }
}
