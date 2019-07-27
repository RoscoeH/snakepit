import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer
} from "recharts";

import * as level from "../maps/level.json";
import Pit from "../models/Pit";
import Population from "../models/Population";

import Block from "./Block";
import Berry from "./Berry";
import Snake from "./Snake";
import Egg from "./Egg";

const pit = new Pit(level);
const population = new Population(pit);

const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 300, pv: 4567, amt: 2400 },
  { name: "Page C", uv: 300, pv: 1398, amt: 2400 },
  { name: "Page D", uv: 200, pv: 9800, amt: 2400 },
  { name: "Page E", uv: 278, pv: 3908, amt: 2400 },
  { name: "Page F", uv: 189, pv: 4800, amt: 2400 }
];

@observer
class App extends Component {
  render() {
    return (
      <div className="app">
        <svg
          className="pit"
          width={pit.canvasWidth}
          height={pit.canvasHeight}
          viewBox={`0 0 ${pit.canvasWidth} ${pit.canvasHeight +
            pit.cellHeight}`}
          onClick={() => setInterval(() => population.step(), 500)} //population.step()}
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
          {Array.from(Array(pit.width)).map(
            (n, i) =>
              i !== 0 && (
                <line
                  key={i}
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.25"
                  x1={i * pit.cellSize}
                  y1={pit.cellHeight}
                  x2={i * pit.cellSize}
                  y2={pit.height * pit.cellSize + pit.cellHeight}
                />
              )
          )}
          {Array.from(Array(pit.height)).map(
            (n, i) =>
              i !== 0 && (
                <line
                  key={i}
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.25"
                  x1={0}
                  y1={i * pit.cellSize + pit.cellHeight}
                  x2={pit.width * pit.cellSize}
                  y2={i * pit.cellSize + pit.cellHeight}
                />
              )
          )}
          <g transform="translate(0 16)">
            {/* Blocks */}
            {pit.blocks.map((block, index) => (
              <Block
                key={index}
                x={block.x}
                y={block.y}
                size={pit.cellSize}
                height={pit.cellHeight}
              />
            ))}

            {/* Berries */}
            {population.berries.map((berry, i) => (
              <Berry
                key={i}
                x={berry.x}
                y={berry.y}
                size={pit.cellSize}
                color={berry.color}
              />
            ))}

            {/* Eggs */}
            {population.eggs.map((egg, i) => (
              <Egg key={i} x={egg.x} y={egg.y} size={pit.cellSize} />
            ))}

            {/* Snakes */}
            {population.population.map((snake, i) => (
              <Snake
                key={i}
                size={pit.cellSize}
                segments={snake.segments}
                color={snake.color}
              />
            ))}
          </g>
        </svg>
        <div
          className={`charts ${population.history.length < 4 ? "hidden" : ""}`}
        >
          <ResponsiveContainer width="100%" height={256}>
            <LineChart
              data={population.history.slice()}
              margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
            >
              <Line dataKey="population" stroke="#bdF271" />
              {/* <Line dataKey="longBerries" stroke="#5BBF54" /> */}
              {/* <Line dataKey="shortBerries" stroke="#51B7F8" /> */}
              {/* <Line dataKey="deathBerries" stroke="#FC5449" /> */}
              <Line dataKey="eggs" stroke="white" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default App;
