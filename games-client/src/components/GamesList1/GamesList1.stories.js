import React from 'react'
import '../../App.css';
import '../../index.css';

import { teams, games } from '../../data'

import {
    BrowserRouter as Router,
} from "react-router-dom";

import GamesList from './GamesList1'

const teamName = 1

export default {
    title: 'GamesList',
    component: GamesList,
};
      
const Template = (args) => <Router><GamesList {...args} /></Router>;

export const TeamsStory = Template.bind({});

TeamsStory.args = {
    border:false,
    teamName:teamName,
    teams:teams,
    games:games,
};