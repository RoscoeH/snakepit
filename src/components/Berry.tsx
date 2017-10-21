import * as React from 'react'
import { SFC } from 'react'

export interface BerryProps {
  x: number,
  y: number,
  size: number,
  color?: string
}

const Berry: SFC<BerryProps> = ({
  x,
  y,
  size,
  color = '#29D9C2'
}) => (
  <g shapeRendering='crispEdges'>
    <circle
      fill={color}
      cx={x * size + size / 2}
      cy={y * size + size / 2}
      r={size / 8}
    />
  </g>
)

export default Berry
