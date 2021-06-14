import { storiesOf } from '@storybook/react'
import React from 'react'
import '../App.css';
import '../index.css';

import { WeatherDisplay } from './Weather'

storiesOf('src/components/WeatherDisplay', module).add(
  'tests weather display',
  () => {
    const error = false
    const celsius = '23'
    const farenheit = '72'
    const place = 'Los Angeles'

    return <div className="background">
            <WeatherDisplay 
            error={error} 
            celsius={celsius} 
            farenheit={farenheit} 
            place={place}  
            />
            </div>
  }
)