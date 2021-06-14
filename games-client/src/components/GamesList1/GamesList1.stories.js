import { storiesOf } from '@storybook/react'
import React from 'react'
import '../../App.css';
import '../../index.css';

import {
    BrowserRouter as Router,
  } from "react-router-dom";

import GamesList from './GamesList1'

const noGames = []

const teamName = 1

const teams = [ 
    {
        "id": 91,
        "team_id": "1",
        "team_name": "Dodgers",
        "team_code": "LAD"
    },
    {
        "id": 92,
        "team_id": "2",
        "team_name": "Reds",
        "team_code": "CIN"
    },
    {
        "id": 93,
        "team_id": "3",
        "team_name": "Blue Jays",
        "team_code": "TOR"
    },
    {
        "id": 94,
        "team_id": "4",
        "team_name": "Pirates",
        "team_code": "PIT"
    },
    {
        "id": 95,
        "team_id": "5",
        "team_name": "Royals",
        "team_code": "KC"
    },
    ]
    const games = [
        {
            "game_id": "62181",
            "home_team": "LAD",
            "home_score": "11",
            "away_team": "STL",
            "away_score": "2",
            "game_date": "2021-06-02T00:00:00.000Z",
            "team_name": "Cardinals",
            "formattedDate": "June 2nd, 2021"
        },
        {
            "game_id": "62169",
            "home_team": "LAD",
            "home_score": "1",
            "away_team": "STL",
            "away_score": "2",
            "game_date": "2021-06-01T00:00:00.000Z",
            "team_name": "Cardinals",
            "formattedDate": "June 1st, 2021"
        },
        {
            "game_id": "62155",
            "home_team": "LAD",
            "home_score": "6",
            "away_team": "STL",
            "away_score": "2",
            "game_date": "2021-05-31T00:00:00.000Z",
            "team_name": "Cardinals",
            "formattedDate": "May 31st, 2021"
        }
    ]

    export default {
        title: 'GamesList',
        component: GamesList,
      };
      
      const Template = (args) => <Router><GamesList {...args} /></Router>;
      
      export const TeamsStory = Template.bind({});
      
      TeamsStory.args = {
        teams:teams,
        games:games,
        teamName:teamName 
      };