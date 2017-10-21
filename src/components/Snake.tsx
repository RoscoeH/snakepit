import * as React from 'react'
import { SFC } from 'react'
import { observer } from 'mobx-react'

import { IPosition } from '../types'


interface SnakeProps {
  segments: Array<IPosition>
  size: number,
  eyeClosed?: boolean,
  color?: string,
  onClick? (): void
}


const Snake: SFC<SnakeProps> = ({
  segments,
  eyeClosed,
  size,
  color = '#bdF271',
  onClick
}) => {
  const points = segments.map((position: IPosition) =>
    `${position.x * size},${position.y * size}`
  ).join(' ')
  return (
    <g
      transform={`translate(${size / 2} ${size / 2})`}
      onClick={onClick}
    >
      <polyline
        fill='none'
        stroke={color}
        strokeWidth='32'
        strokeLinecap='round'
        strokeLinejoin='round'
        points={points}
      />
      {(segments.length > 0) && (
        <g>
          <circle
            fill='#2f2933'
            cx={segments[0].x * size}
            cy={segments[0].y * size}
            r={8}
          />
        </g>
      )}
    </g>
  )
}


export default observer(Snake)
