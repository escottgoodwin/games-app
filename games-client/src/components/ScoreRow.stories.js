import { storiesOf } from '@storybook/react'
import React from 'react'
import '../App.css';
import '../index.css';

import {ScoreRow} from './GamesList1'

storiesOf('src/components/ScoreRow', module)
.add(
  'win score',
  () => {
    const name = 'Cubs'
    const score = 2
    const color = 'winner'
    return <div className="background"><ScoreRow name={name} score={score} color={color} /></div> 
  }
)
.add(
    'lose score',
    () => {
      const name = 'Cubs'
      const score = 1
      const color = 'loser'
      return <div className="background"><ScoreRow name={name} score={score} color={color} /></div> 
    }
  )