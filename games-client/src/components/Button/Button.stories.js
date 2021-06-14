import React from 'react'
import { action } from '@storybook/addon-actions';

import '../../App.css';
import '../../index.css';

import SearchButton from './Button'

export default {
  title: 'SearchButton',
  component: SearchButton,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

const Template = (args) => <SearchButton {...args} />;

export const SearchButtonStory = Template.bind({});

SearchButtonStory.args = {
    handleSearch: action('handleSearch'),
    loading: false,
    styleClass:"button button-submit"
};