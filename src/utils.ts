import { IPosition, Direction } from './types'


export function positionInDirection (position: IPosition, direction: Direction): IPosition {
  let newPosition = { ...position }

  switch (direction) {
    case Direction.NORTH:
      newPosition.y--
      break

    case Direction.EAST:
      newPosition.x++
      break

    case Direction.SOUTH:
      newPosition.y++
      break

    case Direction.WEST:
      newPosition.x--
      break

    default:
  }

  return newPosition
}


export function positionsTouching (position: IPosition, otherPosition: IPosition): boolean {
  const xDistance = Math.abs(position.x - otherPosition.x)
  const yDistance = Math.abs(position.y - otherPosition.y)

  return (xDistance <= 1 && yDistance === 0) || (yDistance <= 1 && xDistance === 0)
}


export function positionsEqual (position: IPosition, otherPosition: IPosition): boolean {
  return (position.x === otherPosition.x && position.y === otherPosition.y)
}


export function positionDistance (position: IPosition, otherPosition: IPosition): number {
  return Math.sqrt(Math.pow(position.x - otherPosition.x, 2) + Math.pow(position.y - otherPosition.y, 2));
}

export function vectorDistance (position: IPosition, otherPosition: IPosition): IPosition {
  return {
    x: otherPosition.x - position.x,
    y: otherPosition.y - position.y
  }
}

export function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFromInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const directionAngles = {
  [Direction.NORTH]: [-90, 240],
  [Direction.EAST]: [0, 360],
  [Direction.SOUTH]: [-240, 90],
  [Direction.WEST]: [-180, 180]
};


export function closestDirection(directions: Direction[], angle: number): Direction {
  let closestDirection: Direction;
  let closest: number = Infinity;

  directions.forEach((direction: Direction) => {
    const d1 = Math.abs(angle - directionAngles[direction][0]);
    const d2 = Math.abs(angle - directionAngles[direction][1]);
    const angleDistance = Math.min(d1, d2);
    // console.log(angleDistance);
    if (angleDistance < closest) {
      closestDirection = direction;
      closest = angleDistance;
    }
  })

  return closestDirection;
}

/**
 * A linear interpolator for hexadecimal colors
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
export function lerpColor(a, b, amount) { 
  let ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}


export function uuid(){
  return(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(
    /1|0/g,
    function(){
      return (0 | Math.random() * 16).toString(16)
    }
  )
}

// const d = [
//   Direction.NORTH,
//   Direction.EAST,
//   Direction.SOUTH
// ];
// console.log(d, closestDirection(d, -185));

// console.log([
//   Direction.NORTH,
//   Direction.EAST,
//   Direction.WEST
// ], -270);

// console.log([
//   Direction.NORTH,
//   Direction.EAST,
//   Direction.WEST
// ], -18);

// console.log([
//   Direction.NORTH,
//   Direction.EAST,
//   Direction.WEST
// ], 270);

// console.log([
//   Direction.NORTH,
//   Direction.EAST,
//   Direction.WEST
// ], 18);


