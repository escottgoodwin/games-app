import React from 'react'
import { action } from '@storybook/addon-actions';
import { teams } from '../../data'

import '../../App.css';
import '../../index.css';

import TeamSearch from './TeamSearch1'

const loading = false

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
