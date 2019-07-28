import { observable, action, computed } from 'mobx'

import Snake from './Snake'
import Pit from './Pit'
import { IPosition, Direction, IBerry, IEgg, IDna } from '../types'
import {
  positionsEqual,
  positionInDirection,
  vectorDistance,
  positionDistance,
  randomIntFromInterval,
  randomFromInterval,
  closestDirection,
  uuid
} from '../utils'
import { LongBerry, ShortBerry, DeathBerry } from './Berries'

const directions = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
]

interface IHistory {
  name: string
  population: number
  lberryCount: number
  sberryCount: number
  dberryCount: number
  eggs: number
}

export default class Population {
  size = 16
  stepEnergy = 0.02
  berryCount = 10
  berrySpawnRate = 0.5
  maxDeathberry = 10
  maxBerries = 20
  eggHealth = 0.3
  adultLength = 3
  mutationRate = 0.05
  time = 0

  @observable population: Snake[] = []
  @observable berries: IBerry[] = []
  @observable eggs: IEgg[] = []
  @observable history: IHistory[] = []

  constructor(private pit: Pit) {
    this.generateRandomSnakes(this.size)
    this.generateRandomFood(this.berryCount, null)
  }

  start() {
    setInterval(() => this.step(), 250)
  }

  @computed get deathberryCount() {
    return this.berries.filter(berry => berry instanceof DeathBerry).length
  }

  @action step() {
    this.history.push({
      name: `${this.time}`,
      population: this.population.length,
      lberryCount: this.berries.filter(berry => berry instanceof LongBerry)
        .length,
      sberryCount: this.berries.filter(berry => berry instanceof ShortBerry)
        .length,
      dberryCount: this.berries.filter(berry => berry instanceof DeathBerry)
        .length,
      eggs: this.eggs.length
    })

    this.updateSnakes()
    this.updateEggs()

    if (
      this.berries.length < this.maxBerries &&
      Math.random() < this.berrySpawnRate
    ) {
      this.generateRandomFood(1, null)
    }

    this.time++
  }

  @action updateEggs() {
    this.eggs.forEach(egg => {
      egg.health -= this.stepEnergy
      if (egg.health <= 0) {
        this.eggs.splice(this.eggs.indexOf(egg), 1)
        this.population.push(
          new Snake(
            uuid(),
            this.pit,
            [{ x: egg.x, y: egg.y }, { x: egg.x, y: egg.y }],
            egg.dna
          )
        )
      }
    })
  }

  @action updateSnakes() {
    this.population.forEach(snake => {
      // Take a step and maybe eat a berry
      const direction = this.pickDirectionForSnake(snake)
      if (direction !== null) {
        // Check if there's a berry at the new position
        const newPosition = positionInDirection(snake.head, direction)
        const berryAtNewPoisiton = this.berries.find(berry =>
          positionsEqual(berry, newPosition)
        )

        if (berryAtNewPoisiton) {
          berryAtNewPoisiton.effect(snake)
          this.berries.splice(this.berries.indexOf(berryAtNewPoisiton), 1)

          if (!(berryAtNewPoisiton instanceof LongBerry)) {
            snake.move(direction)
          }
        } else {
          snake.move(direction)
        }
      }

      // Maybe lay an egg
      if (
        snake.segments.length > this.adultLength &&
        Math.random() < snake.dna.eggRate
      ) {
        this.eggs.push({
          x: snake.tail.x,
          y: snake.tail.y,
          health: this.eggHealth,
          dna: this.mutateDna(snake.dna)
        })
      }

      // Deduct health
      snake.health -= this.stepEnergy
      if (snake.health <= 0) {
        // Kill snake and leave food
        this.population.splice(this.population.indexOf(snake), 1)
        snake.segments.forEach(segment => {
          const berry = this.pickRandomBerry([
            { berry: LongBerry, spawnChance: 5 },
            { berry: ShortBerry, spawnChance: 3 },
            { berry: DeathBerry, spawnChance: 2 }
          ])
          this.berries.push(new berry(segment.x, segment.y))
        })
      }
    })
  }

  mutateDna(dna: IDna): IDna {
    const mutatedDna = { ...dna }

    if (Math.random() < this.mutationRate) {
      const genes = Object.keys(dna)
      const geneKey = genes[randomIntFromInterval(0, genes.length - 1)]
      const gene = dna[geneKey]
      const d = [-1, 1]
      mutatedDna[geneKey] =
        gene +
        gene * randomFromInterval(0.01, 0.5) * d[randomIntFromInterval(0, 1)]
    }

    return mutatedDna
  }

  pickDirectionForSnake(snake: Snake): Direction {
    let closestSnake: IPosition
    let closest: number = Infinity

    // Get all the other snake segements
    const segments = this.population.slice().reduce((s, otherSnake) => {
      return snake === otherSnake ? s : otherSnake.segments.concat(s)
    }, [])

    // Find the closest snake segment
    segments.forEach((segment: IPosition) => {
      const distance = positionDistance(snake.head, segment)
      const vector = vectorDistance(snake.head, segment)
      if (distance < closest) {
        closestSnake = vector
        closest = distance
      }
    })

    // Find the closest longberry
    let closestLongberry: IPosition
    let closestShortberry: IPosition
    let closestDeathberry: IPosition
    let closestL = Infinity
    let closestS = Infinity
    let closestD = Infinity

    this.berries.forEach(berry => {
      const distance = positionDistance(snake.head, berry)
      const vector = vectorDistance(snake.head, berry)
      if (berry instanceof LongBerry && distance < closestL) {
        closestLongberry = vector
        closestL = distance
      } else if (berry instanceof ShortBerry && distance < closestS) {
        closestShortberry = vector
        closestS = distance
      } else if (berry instanceof DeathBerry && distance < closestD) {
        closestDeathberry = vector
        closestD = distance
      }
    })

    let closestEntities = [
      closestSnake,
      closestLongberry,
      closestShortberry,
      closestDeathberry
    ]

    // Normalise the vectors
    closestEntities = closestEntities.map(entity => {
      if (entity) {
        const magnitude = Math.sqrt(
          Math.pow(entity.x, 2) + Math.pow(entity.y, 2)
        )
        return magnitude > 0
          ? { x: entity.x / magnitude, y: entity.y / magnitude }
          : entity
      }
    })

    const entityAttractions = [
      snake.dna.snakeAttraction,
      snake.dna.longberryAttraction,
      snake.dna.shortberryAttraction,
      snake.dna.deathberryAttraction
    ]

    const desiredVector = closestEntities.reduce(
      (prev, entity, i) =>
        entity
          ? {
              x: prev.x + entity.x * entityAttractions[i],
              y: prev.y + entity.y * entityAttractions[i]
            }
          : prev,
      { x: 0, y: 0 }
    )

    const desiredAngle =
      (Math.atan2(desiredVector.y, desiredVector.x) * 180) / Math.PI

    const availableDirections = directions.filter(
      direction =>
        !this.cellOccupied(positionInDirection(snake.head, direction))
    )
    if (availableDirections.length > 0) {
      return closestDirection(availableDirections, desiredAngle)
    } else {
      return null
    }
  }

  snakeAt(position: IPosition): boolean {
    return this.population.some(snake => {
      return snake.segments.some(segment => positionsEqual(position, segment))
    })
  }

  berryAt(position: IPosition): boolean {
    return this.berries.some(berry => positionsEqual(position, berry))
  }

  eggAt(position: IPosition): boolean {
    return this.eggs.some(egg => positionsEqual(position, egg))
  }

  cellOccupied(position: IPosition): boolean {
    return (
      this.pit.blockAt(position) ||
      this.snakeAt(position) ||
      this.eggAt(position)
    )
  }

  findEmptyPosition(): IPosition {
    let position: IPosition = null
    let count = 0

    // Find a suitable head position
    while (
      !position ||
      this.cellOccupied(position) ||
      (this.berryAt(position) && count < 10000)
    ) {
      position = {
        x: Math.floor(Math.random() * this.pit.width),
        y: Math.floor(Math.random() * this.pit.height)
      }
    }
    return position
  }

  findEmptyPositionAround(position: IPosition): IPosition {
    let emptyPos: IPosition = null

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i]
      const maybeEmptyPos = positionInDirection(position, direction)

      if (!this.cellOccupied(maybeEmptyPos) && !this.berryAt(maybeEmptyPos)) {
        emptyPos = maybeEmptyPos
        break
      }
    }
    return emptyPos
  }

  generateRandomSnakes(n: number) {
    for (let i = 0; i < n; i++) {
      // Generate random two positions
      const position = this.findEmptyPosition()
      const segments = [position, this.findEmptyPositionAround(position)]

      if (segments) {
        this.population.push(new Snake(uuid(), null, segments))
      }
    }
  }

  generateRandomFood(
    n: number,
    berryType: new (x: number, y: number) => IBerry
  ) {
    let berry = berryType
    const berries = [
      { berry: LongBerry, spawnChance: 5 },
      { berry: ShortBerry, spawnChance: 3 },
      { berry: DeathBerry, spawnChance: 2 }
    ]

    if (this.deathberryCount >= this.maxDeathberry) {
      berries.pop()
    }

    for (let i = 0; i < n; i++) {
      if (!berryType) {
        berry = this.pickRandomBerry(berries)
      }

      // Find position for berry
      const position = this.findEmptyPosition()
      this.berries.push(new berry(position.x, position.y))
    }
  }

  pickRandomBerry(berryList: any): new (x: number, y: number) => IBerry {
    let chance = Math.random()

    // Normalise berry chances
    const totalChances = berryList
      .map(berry => berry.spawnChance)
      .reduce((prev, spawnChance) => prev + spawnChance, 0)

    for (let i = 0; i < berryList.length; i++) {
      const { berry, spawnChance } = berryList[i]
      const scaledChance = spawnChance / totalChances
      if (chance < scaledChance) {
        return berry
      }

      chance -= scaledChance
    }
  }
}
