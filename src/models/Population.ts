import { Snake } from './Snake'
import { Pit } from './Pit';
import { IPosition, Direction, IBerry } from '../types';
import {
  positionsEqual,
  positionInDirection,
  vectorDistance,
  positionDistance,
  randomIntFromInterval,
  closestDirection
} from '../utils';
import { LongBerry } from './Berries';


const directions = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
];


export class Population {
  size = 16;
  stepEnergy = 0.01;
  berryCount = 6;
  population: Snake[] = [];
  berries: IBerry[] = []; 

  constructor(private pit: Pit) {
    this.generateRandomSnakes(this.size);
    this.generateRandomFood(this.berryCount, LongBerry);

    console.log(this.berries);
    setInterval(() => this.step(), 100);
  }

  step() {
    this.population.forEach(snake => {
      // Take a step and maybe eat a berry
      const direction = this.pickDirectionForSnake(snake);
      if (direction !== null) {
        // Check if there's a berry at the new position
        const newPosition = positionInDirection(snake.head, direction);
        const berryAtNewPoisiton = this.berries.find(berry => positionsEqual(berry, newPosition));

        if (berryAtNewPoisiton) {
          berryAtNewPoisiton.effect(snake);
          this.berries.splice(this.berries.indexOf(berryAtNewPoisiton), 1);
          this.generateRandomFood(1, LongBerry);
        } else {
          snake.move(direction);
        }

      }

      // Deduct health
      snake.health -= this.stepEnergy;
      if (snake.health <= 0) {
        this.population.splice(this.population.indexOf(snake), 1);
      }
    })
  }

  pickDirectionForSnake(snake: Snake): Direction {
    let closestSnake: IPosition;
    let closest: number = Infinity;

    // Get all the other snake segements
    const segments = this.population.slice().reduce((s, otherSnake) => {
      return snake === otherSnake ? s : otherSnake.segments.concat(s);
    }, []);
    
    // Find the closest snake segment
    segments.forEach((segment: IPosition) => {
        const distance = positionDistance(snake.head, segment);
        const vector = vectorDistance(snake.head, segment);
        if (distance < closest) {
          closestSnake = vector;
          closest = distance;
        }
      });

    // Find the closest longberry
    let closestLongBerry: IPosition;
    closest = Infinity;

    this.berries.forEach((berry) => {
      const distance = positionDistance(snake.head, berry);
      const vector = vectorDistance(snake.head, berry);
      if (distance < closest){
        closestLongBerry = vector;
        closest = distance;
      }
    });

    // console.log('dist', closest);
    const closestEntities = [closestSnake, closestLongBerry];
    const entityAttractions = [snake.dna.snakeAttraction, snake.dna.longberryAttraction];

    const desiredVector = closestEntities.reduce((prev, entity, i) =>
      entity
        ? { x: prev.x + entity.x * entityAttractions[i], y: prev.y + entity.y * entityAttractions[i] }
        : prev,
        { x: 0, y: 0 }
    );

    const desiredAngle = Math.atan2(desiredVector.y, desiredVector.x) * 180 / Math.PI;

    // console.log(snake.snakeAttraction, scaledClosestSnake)

    const availableDirections = directions.filter(direction =>
        !this.cellOccupied(positionInDirection(snake.head, direction))
    )
    if (availableDirections.length > 0) {
      // console.log(availableDirections, desiredAngle);
      return closestDirection(availableDirections, desiredAngle);
    } else {
      return null;
    }
  }


  snakeAt(position: IPosition): boolean {
    return this.population.some((snake) => {
      return snake.segments.some((segment) => positionsEqual(position, segment))
    })
  }

  cellOccupied(position: IPosition): boolean {
    return this.pit.blockAt(position) || this.snakeAt(position);
  }

  findEmptyPosition(): IPosition {
    let position: IPosition = null;
    let count = 0;

    // Find a suitable head position
    while (!position || this.cellOccupied(position) && count < 10000) {
      position = {
        x: Math.floor(Math.random() * this.pit.width),
        y: Math.floor(Math.random() * this.pit.height)
      };
    }
    return position;
  }

  findEmptyPositionAround(position: IPosition): IPosition {
    let emptyPos: IPosition = null;

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const maybeEmptyPos = positionInDirection(position, direction);

      if (!this.cellOccupied(maybeEmptyPos)) {
        emptyPos = maybeEmptyPos;
        break;
      }
    }
    return emptyPos;
  }

  generateRandomSnakes(n: number) {
    for (let i = 0; i < n; i++) {
      // Generate random two positions
      const position = this.findEmptyPosition();
      const segments = [
        position,
        this.findEmptyPositionAround(position)
      ];

      if (segments) {
        this.population.push(new Snake(this.population.length, null, segments));
      }
    }
  }

  generateRandomFood(n: number, berryType: new (x: number, y: number) => IBerry) {
    for (let i = 0; i < n; i++) {
      // Find position for berry
      const position = this.findEmptyPosition();
      this.berries.push(new berryType(position.x, position.y));
    }
  }
}