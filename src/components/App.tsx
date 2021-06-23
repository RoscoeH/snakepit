import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { pit } from '../models/Pit'
import { population } from '../models/Population'

import Toolbar from './Toolbar'
import Block from './Block'
import Berry from './Berry'
import Snake from './Snake'
import Egg from './Egg'

const BORDER_INSET = 32

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="header">
          <div className="box" />
          <h1 className="title">Snakepit</h1>{' '}
          <span
            className={`time ${population.time > 0 ? '' : 'hidden'}`}
          >
            {population.time}
          </span>
        </div>
        <svg
          className="pit"
          width={pit.canvasWidth}
          height={pit.canvasHeight}
          viewBox={`0 0 ${pit.canvasWidth} ${pit.canvasHeight +
            pit.cellHeight}`}
          preserveAspectRatio="xMidYMin meet"
        >
          <rect
            x={BORDER_INSET}
            y={BORDER_INSET}
            width={pit.canvasWidth - BORDER_INSET * 2}
            height={pit.canvasHeight - BORDER_INSET * 2}
            rx={BORDER_INSET * 2}
            stroke="#fff"
            opacity="0.1"
            strokeWidth="8"
            fill="none"
          />
          {population.berries.map((berry, i) => (
            <Berry
              key={i}
              x={berry.x}
              y={berry.y}
              size={pit.cellSize}
              color={berry.color}
            />
          ))}

          {population.eggs.map((egg, i) => (
            <Egg key={i} x={egg.x} y={egg.y} size={pit.cellSize} />
          ))}
          {population.population.map((snake, i) => (
            <Snake
              key={i}
              size={pit.cellSize}
              segments={snake.segments}
              color={snake.color}
            />
          ))}
          {/* </g> */}
        </svg>
        <Toolbar />
      </div>
    )
  }
}

export default App
