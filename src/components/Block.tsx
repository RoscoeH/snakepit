import * as React from 'react'
import { SFC } from 'react'

export interface BlockProps {
  x: number,
  y: number,
  size: number,
  height: number,
  color?: string
}

const Block: SFC<BlockProps> = ({
  x,
  y,
  size,
  height,
  color = '#29D9C2'
}) => (
  <g shapeRendering='crispEdges'>
    <rect
      fill={color}
      x={x * size}
      y={y * size - height}
      width={size}
      height={size + height}
    />
    <rect
      fill='#333'
      opacity='0.333'
      x={x * size}
      y={y * size + (size - height)}
      width={size}
      height={height}
    />
  </g>
)

export default Block
