import { observable, action, computed } from 'mobx';

import { Snake } from './Snake'
import { Pit } from './Pit';
import { IPosition, Direction, IBerry, IEgg } from '../types';
import {
  positionsEqual,
  positionInDirection,
  vectorDistance,
  positionDistance,
  randomIntFromInterval,
  closestDirection,
  uuid
} from '../utils';
import { LongBerry, ShortBerry, DeathBerry } from './Berries';


const directions = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
];


export class Population {
  size = 16;
  stepEnergy = 0.02;
  berryCount = 10;
  berrySpawnRate = 0.5;
  maxDeathberry = 10;
  @observable population: Snake[] = [];
  @observable berries: IBerry[] = [];
  @observable eggs: IEgg[] =[]; 

  constructor(private pit: Pit) {
    this.generateRandomSnakes(this.size);
    this.generateRandomFood(this.berryCount, null);
  }

  @computed get deathberryCount() {
    return this.berries.filter(berry => berry instanceof DeathBerry).length;
  }

  @action step() {
    this.updateSnakes();
    this.updateEggs();

    if (Math.random() < this.berrySpawnRate) {
      this.generateRandomFood(1, null);
    }
  }

  @action updateEggs() {
    this.eggs.forEach(egg => {
      egg.health -= this.stepEnergy;
      if (egg.health <= 0) {
        this.eggs.splice(this.eggs.indexOf(egg), 1);
        this.population.push(
          new Snake(uuid(), this.pit, [
            { x: egg.x, y: egg.y },
            { x: egg.x, y: egg.y }
          ], egg.dna)
        );
      }
    });
  }

  @action updateSnakes() {
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

          if (!(berryAtNewPoisiton instanceof LongBerry)) {
            snake.move(direction);
          }
        } else {
          snake.move(direction);
        }

      }

      // Maybe lay an egg
      if (snake.segments.length > 2 && Math.random() < snake.dna.eggRate) {
        this.eggs.push({
          x: snake.tail.x,
          y: snake.tail.y,
          health: 0.1,
          dna: snake.dna
        });
      }

      // Deduct health
      snake.health -= this.stepEnergy;
      if (snake.health <= 0) {
        this.population.splice(this.population.indexOf(snake), 1);
      }
    });
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
    let closestLongberry: IPosition;
    let closestShortberry: IPosition;
    let closestDeathberry: IPosition;
    let closestL = Infinity;
    let closestS = Infinity;
    let closestD = Infinity;

    this.berries.forEach((berry) => {
      const distance = positionDistance(snake.head, berry);
      const vector = vectorDistance(snake.head, berry);
      if (berry instanceof LongBerry && distance < closestL) {
        closestLongberry = vector;
        closestL = distance;
      } else if (berry instanceof ShortBerry && distance < closestS) {
        closestShortberry = vector;
        closestS = distance;
      } else if (berry instanceof DeathBerry && distance < closestD) {
        closestDeathberry = vector;
        closestD = distance;
      }
    });

    let closestEntities = [
      closestSnake,
      closestLongberry,
      closestShortberry,
      closestDeathberry
    ];

    // Normalise the vectors
    closestEntities = closestEntities.map(entity => {
      if (entity) {
        const magnitude = Math.sqrt(Math.pow(entity.x, 2) + Math.pow(entity.y, 2));
        return (magnitude > 0)
          ? { x: entity.x / magnitude, y: entity.y / magnitude }
          : entity;
      }
    });

    const entityAttractions = [
      snake.dna.snakeAttraction,
      snake.dna.longberryAttraction,
      snake.dna.shortberryAttraction,
      snake.dna.deathberryAttraction
    ];

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
    });
  }

  berryAt(position: IPosition): boolean {
    return this.berries.some(berry => positionsEqual(position, berry));
  }

  eggAt(position: IPosition): boolean {
    return this.eggs.some(egg => positionsEqual(position, egg));
  }

  cellOccupied(position: IPosition): boolean {
    return this.pit.blockAt(position) || this.snakeAt(position) || this.eggAt(position);
  }

  findEmptyPosition(): IPosition {
    let position: IPosition = null;
    let count = 0;

    // Find a suitable head position
    while (
      !position ||
      this.cellOccupied(position) ||
      this.berryAt(position)
      && count < 10000
    ) {
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

      if (!this.cellOccupied(maybeEmptyPos) && !this.berryAt(maybeEmptyPos)) {
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
        this.population.push(new Snake(uuid(), null, segments));
      }
    }
  }

  generateRandomFood(n: number, berryType: new (x: number, y: number) => IBerry) {
    let berry = berryType;
    const berries =  [
      { berry: LongBerry, spawnChance: 5 },
      { berry: ShortBerry, spawnChance: 3 },
      { berry: DeathBerry, spawnChance: 2 }
    ];

    if (this.deathberryCount >= this.maxDeathberry) {
      berries.pop();
    }

    for (let i = 0; i < n; i++) {
      if (!berryType) {
        berry = this.pickRandomBerry(berries);
      }

      // Find position for berry
      const position = this.findEmptyPosition();
      this.berries.push(new berry(position.x, position.y));
    }
  }

  pickRandomBerry(berryList: (new (x: number, y: number) => IBerry)[]): new (x: number, y: number) => IBerry {
    let chance = Math.random();
    let berryList = berries;

    // Normalise berry chances
    const totalChances = berryList
      .map(berry => berry.spawnChance)
      .reduce((prev, spawnChance) => prev + spawnChance, 0);

    for (let i = 0; i < berries.length; i++) {
      const { berry, spawnChance } = berries[i];
      const scaledChance = spawnChance / totalChances
      if (chance < scaledChance) {
        return berry;
      }

      chance -= scaledChance;
    }
  }
}