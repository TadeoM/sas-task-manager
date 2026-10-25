import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: '#616161',
        },
      },
    },
    dark: {
      palette: {
        text: {
          primary: '#c7c7c7',
        },
      },
    },
  },
  cssVariables: { colorSchemeSelector: 'media' },
});
