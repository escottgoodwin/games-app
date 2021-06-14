import { storiesOf } from '@storybook/react'
import React from 'react'
import '../../App.css';
import '../../index.css';

import  ScoreRow from '../ScoreRow/ScoreRow'

export default {
  title: 'ScoreRow',
  component: ScoreRow,
  argTypes: {
    color: {
      options: ['winner', 'loser'],
      control: { type: 'radio' }
    }
  }
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => <ScoreRow {...args} />;

export const ScoreStory = Template.bind({});

ScoreStory.args = {
  /*👇 The args you need here will depend on your component */
  name: 'Cubs',
  score: 2,
  color:'winner'
};