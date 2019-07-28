import * as React from 'react'
import { SFC } from 'react'
import { observer } from 'mobx-react'

import { population } from '../models/Population'
import * as playIconSrc from '../img/play.svg'
import * as pauseIconSrc from '../img/pause.svg'

const Toolbar: SFC = () => {
  return (
    <div className="toolbar">
      {population.isPlaying ? (
        <button className="toolbar__button" onClick={() => population.stop()}>
          <img src={pauseIconSrc} className="toolbar__icon" />
        </button>
      ) : (
        <button className="toolbar__button" onClick={() => population.start()}>
          <img src={playIconSrc} className="toolbar__icon" />
        </button>
      )}
    </div>
  )
}

export default observer(Toolbar)
