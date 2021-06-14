import { storiesOf } from '@storybook/react'
import React from 'react'
import '../../App.css';
import '../../index.css';

import { WeatherDisplay } from './Weather'

export default {
  title: 'WeatherDisplay',
  component: WeatherDisplay,
};

const Template = (args) => <WeatherDisplay {...args} />;

export const WeatherStory = Template.bind({});

WeatherStory.args = {
  error:false,
  celsius:23, 
  farenheit:72,
  place:'Los Angeles'
};

// storiesOf('src/components/WeatherDisplay', module).add(
//   'tests weather display',
//   () => {
//     const error = false
//     const celsius = '23'
//     const farenheit = '72'
//     const place = 'Los Angeles'

//     return <WeatherDisplay 
//             error={error} 
//             celsius={celsius} 
//             farenheit={farenheit} 
//             place={place}  
//             />
//   }
// )