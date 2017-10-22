import * as React from 'react'
import { SFC } from 'react'

export interface EggProps {
  x: number,
  y: number,
  size: number,
  color?: string
}

const Egg: SFC<EggProps> = ({
  x,
  y,
  size,
  color = 'white'
}) => (
  <g shapeRendering='crispEdges'>
    <circle
      fill={color}
      cx={x * size + size / 2}
      cy={y * size + size / 2}
      r={size / 4}
    />
  </g>
)

export default Egg
