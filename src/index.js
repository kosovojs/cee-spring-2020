import React from 'react';
import ReactDOM from 'react-dom';
import theme from './theme';

import { ThemeProvider } from '@material-ui/core/styles';

import App from './components/App/container';

ReactDOM.render(<ThemeProvider theme={theme}>
	<App />
</ThemeProvider>, document.getElementById('app'));
