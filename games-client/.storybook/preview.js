
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: 'standard',
    values: [
      {
        name: 'standard',
        value: '#282c34',
      },
      {
        name: 'blue',
        value: 'blue',
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}