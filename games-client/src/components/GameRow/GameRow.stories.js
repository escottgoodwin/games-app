import React from 'react'
import '../../App.css';
import '../../index.css';

import {
    BrowserRouter as Router,
  } from "react-router-dom";

import GameRow from '../GameRow/GameRow'

export default {
  title: 'GameRow',
  component: GameRow,
};

const Template = (args) => <Router><GameRow {...args} /></Router>;

export const GameStory = Template.bind({});

GameStory.args = {
  formattedDate: 'June 10, 2021', 
  home_name: 'Angeles', 
  team_name: 'Dodgers', 
  game_id: 84,
  away_score:4, 
  home_score:1, 
};
