import { storiesOf } from '@storybook/react'
import React from 'react'
import '../App.css';
import '../index.css';

import Error from './Error'

storiesOf('src/components/Error', module).add(
  'tests error message',
  () => {
    const error = true
    const message = 'Error getting game data!'
    return <Error error={error} message={message} />
  }
)