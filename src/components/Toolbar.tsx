import * as React from 'react'
import { SFC } from 'react'
import { observer } from 'mobx-react'

import { population } from '../models/Population'
import playIconSrc from '../img/play.svg'
import pauseIconSrc from '../img/pause.svg'
import resetIconSrc from '../img/reset.svg'

function toggle() {
  if (population.isPlaying) {
    population.stop()
  } else {
    population.start()
  }
}

function visible() {
  return population.time > 0 ? '' : 'transparent'
}

const Toolbar: SFC = () => {
  return (
    <div className="toolbar">
      <button
        className={`toolbar__button fade-in-out ${visible()}`}
        onClick={() => population.reset()}
      >
        <img src={resetIconSrc} className="toolbar__icon" />
      </button>

      <button className="toolbar__button" onClick={toggle}>
        <img
          src={population.isPlaying ? pauseIconSrc : playIconSrc}
          className="toolbar__icon"
        />
      </button>

      <button
        className={`toolbar__button fade-in-out ${visible()}`}
        onClick={() => population.toggleSpeed()}
      >
        {`×${population.speed}`}
      </button>
    </div>
  )
}

export default observer(Toolbar)
