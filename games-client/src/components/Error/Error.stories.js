import { storiesOf } from '@storybook/react'
import React from 'react'
import '../../App.css';
import '../../index.css';

import Error from './Error'

export default {
  title: 'Error',
  component: Error,
};

const Template = (args) => <Error {...args} />;

export const ErrorStory = Template.bind({});

ErrorStory.args = {
  error: true,
  message: 'Error getting game data!'
};

// storiesOf('src/components/Error', module).add(
//   'tests error message',
//   () => {
//     const error = true
//     const message = 'Error getting game data!'
//     return <Error error={error} message={message} />
//   }
// )