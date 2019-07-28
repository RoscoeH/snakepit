import * as React from 'react'
import { SFC } from 'react'
import { observer } from 'mobx-react'

import { population } from '../models/Population'
import * as playIconSrc from '../img/play.svg'
import * as pauseIconSrc from '../img/pause.svg'

function toggle() {
  if (population.isPlaying) {
    population.stop()
  } else {
    population.start()
  }
}

const Toolbar: SFC = () => {
  return (
    <div className="toolbar">
      <button className="toolbar__button" onClick={toggle}>
        <img
          src={population.isPlaying ? pauseIconSrc : playIconSrc}
          className="toolbar__icon"
        />
      </button>
      <button
        className="toolbar__button"
        onClick={() => population.toggleSpeed()}
      >
        {`×${population.speed}`}
      </button>
    </div>
  )
}

export default observer(Toolbar)
