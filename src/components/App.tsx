import * as React from "react";
import { Component } from 'react';
import { observer } from 'mobx-react';

import * as level from '../maps/level.json';
import { Pit } from '../models/pit';
import { Population } from '../models/population';

import Block from './Block';
import Berry from './Berry';
import Snake from './Snake';

const pit = new Pit(level);
const population = new Population(pit);

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <svg
          className="pit"
          width={pit.canvasWidth}
          height={pit.canvasHeight}
          viewBox={`0 0 ${pit.canvasWidth} ${pit.canvasHeight + pit.cellHeight}`}
          onClick={() => setInterval(() => population.step(), 200)} //population.step()}
        >
          {/* Background */}
          <rect
            x={0}
            y={0}
            width={pit.canvasWidth}
            height={pit.canvasHeight + pit.cellHeight}
            fill="#2f2933"
          />

          {/* Gridlines */}
          {Array.from(Array(pit.width)).map((n, i) => (
            i !== 0 && <line
              key={i}
              stroke='white'
              strokeWidth='2'
              opacity='0.25'
              x1={i * pit.cellSize}
              y1={pit.cellHeight}
              x2={i * pit.cellSize}
              y2={pit.height * pit.cellSize + pit.cellHeight}
            />
          ))}
          {Array.from(Array(pit.height)).map((n, i) => (
            i !== 0 && <line
              key={i}
              stroke='white'
              strokeWidth='2'              
              opacity='0.25'
              x1={0}
              y1={i * pit.cellSize + pit.cellHeight}
              x2={pit.width * pit.cellSize}
              y2={i * pit.cellSize + pit.cellHeight}
            />
          ))}
          <g transform="translate(0 16)">
            {/* Blocks */}
            {pit.blocks.map((block, index) =>
              <Block
                key={index}
                x={block.x}
                y={block.y}
                size={pit.cellSize}
                height={pit.cellHeight}
              />
            )}

            {/* Berries */}
            {population.berries.map((berry, i) => 
              <Berry
                key={i}
                x={berry.x}
                y={berry.y}
                size={pit.cellSize}
                color={berry.color}
              />
            )}

            {/* Snakes */}
            {population.population.map((snake, i) =>
              <Snake
                key={i}
                size={pit.cellSize}
                segments={snake.segments}
                color={snake.color}
              />
            )}
          </g>
        </svg>
      </div>
    );
  }
}

export default App;
