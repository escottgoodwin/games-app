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
    text:'Submit',
    handleSearch: action('handleSearch'),
    styleClass:"button button-submit"
};

export const SuccessButtonStory = Template.bind({});

SuccessButtonStory.args = {
    handleSearch: action('handleSearch'),
    text:'Success',
    styleClass:"button button-success"
};

export const ErrorButtonStory = Template.bind({});

ErrorButtonStory.args = {
    handleSearch: action('handleSearch'),
    text:'Error',
    styleClass:"button button-error"
};

export const LoadingButtonStory = Template.bind({});

LoadingButtonStory.args = {
    handleSearch: action('handleSearch'),
    text:'Loading',
    styleClass:"button button-loading"
};