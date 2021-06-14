import { storiesOf } from '@storybook/react'
import React from 'react'
import '../App.css';
import '../index.css';

import {
    BrowserRouter as Router,
  } from "react-router-dom";

import {GameRow} from './GamesList1'

const game = {
    formattedDate: 'June 10, 2021', 
    home_name: 'Angeles', 
    team_name: 'Dodgers', 
    game_id: 84
}

storiesOf('src/components/GameRow', module)
.add(
  'game row away win',
  () => {
    const game1 = {
        ...game,
        away_score:4, 
        home_score:1, 
    }

    return <Router><div className="background"><GameRow {...game1} /></div></Router> 
  }
)
.add(
    'game row home win',
    () => {

      const game2 = {
        ...game,
        away_score:1, 
        home_score:4, 
    }
  
      return <Router><div className="background"><GameRow {...game2} /></div></Router>
    }
  )