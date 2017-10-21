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


