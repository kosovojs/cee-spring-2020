import React, { useEffect } from 'react';
import Mainlist from '../MainList';
import CountryList from '../CountryList';
import MapObject from '../Map';
import Header from '../Header';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';

import ErrorBoundary from './errorBoundary';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotFound = ({ location }) => (
	<div>
		<h3>
			Did not found page <code>{location.pathname}</code>
		</h3>
	</div>
);

NotFound.propTypes = {
	location: PropTypes.object
};

const App = () => {
	return (
		<>
			<Router>
				<ErrorBoundary>
					<CssBaseline />
					<Header />
					<Switch>
						<Route exact path='/' component={Mainlist} />
						<Route exact path='/country/:country?/:category?' component={CountryList} />
						<Route exact path='/map' component={MapObject} />
						<Route component={NotFound} />
					</Switch>
				</ErrorBoundary>
				<ToastContainer
					position='bottom-right'
					autoClose={2500}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable={false}
					pauseOnHover
				/>
			</Router>
		</>
	);
};

export default App;
