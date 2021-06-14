import React from 'react'
import { action } from '@storybook/addon-actions';

import '../../App.css';
import '../../index.css';

import TeamSearch from './TeamSearch1'

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
    const loading = false
    const handleTeam = ()=>{} 
    const handleGameNumber = ()=>{} 
    const handleSearch = ()=>{} 

export default {
    title: 'TeamSearch',
    component: TeamSearch,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  };
  
  const Template = (args) => <TeamSearch {...args} />;
  
  export const TeamSearchStory = Template.bind({});
  
  TeamSearchStory.args = {
    teams: teams,
    handleTeam: action('handleTeam'),
    handleGameNumber: action('handleGameNumber'),
    loading: loading,
    handleSearch: action('handleSearch'),
  };
