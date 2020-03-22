import React, {Component} from 'react';
import api from '../../api/methods';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Autocomplete from './autocompleter';
import Results from './results';

const styles = theme => ({
	bodyWrapper: {
		margin: 25
	},
	filterSection: {
		display: 'flex',
		marginBottom: 10,
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 300
		}
	}
});

class CountryList extends Component {
	state = {
		state: 'init',
		error: null,
		data: [],
		countries: [],
		categories: ['full','eninfoboxes','frinfoboxes'],
		country: null,
		category: 'full',
		filter: '',
		inputValues: {
			country: '',
			category: '',
		}
	}

	setData = async () => {
		const {country, category} = this.state;

		console.log(country, category)

		if (country === null || category === null) {
			this.setState({
				data: [],
				state: 'init'
			});
			return;
		}

		this.setState({state: 'loading'});

		const {articles} = await api.tool.countryData({country, category});

		this.setState({
			data: articles,
			state: 'loaded'
		});
	}

	setCountries = async () => {
		const countries = await api.tool.countries();

		this.setState({
			countries
		});
	}

	handleDataFromURL = () => {
		let { country, category } = this.props.match.params;
		const {categories} = this.state;

		this.setState({
			country: country ? country: null,
			category: category && categories.includes(category) ? category : null,
			inputValues: {
				country: country ? country: '',
				category: category && categories.includes(category) ? category : '',
			}
		}, () => {
			this.setData();
		})
	}

	updateURL = () => {
		/* const {country, category } = this.state;

		const urlParts = [country, category].filter(Boolean).join('/');

		this.props.history.push(`/country/${urlParts}`) */
	}

	componentDidMount = () => {
		this.setCountries();
		//this.handleDataFromURL();
	}

	/* componentDidUpdate = (prevProps) => {
		if (this.props.match.params.country !== prevProps.match.params.country || this.props.match.params.category !== prevProps.match.params.category) {
			this.handleDataFromURL();
		}
	} */

	handleChange = event => {
		const { name, value } = event.target;

		this.setState({ [name]: value });
	};

	handleInputChange = event => {
		const { name, value } = event.target;

		this.setState({ inputValues: {...this.state.inputValues, [name]: value }});
	};

	handleCountry = (opt, name) => {
		this.setState(prevState => ({
			[name]: opt,
			inputValues: {
				...prevState,
				[name]: opt,
			}
		}), () => {
			//this.updateURL();
			this.setData();
		});
	}

	render = () => {
		const {state, data, updated, error, filter, country, countries, categories, category, inputValues} = this.state;
		const {classes} = this.props;

		const {countries: fdsf, ...stateToShow} = this.state;

		return <Typography component='div' variant='body1' className={classes.bodyWrapper}>
			<div className={classes.filterSection}>
			<Autocomplete label='Country' options={countries} name='country' /* value={inputValues.country} */ /* onChange={this.handleInputChange} */ setPendingValue={(value) => this.handleCountry(value, 'country')} />
			{/* <Autocomplete label='Category' disabled={country === null} options={categories} name='category' value={inputValues.category} onChange={this.handleInputChange} setPendingValue={(value) => this.handleCountry(value, 'category')} /> */}

				<TextField
					label='Filter'
					name='filter'
					onChange={this.handleChange}
					value={filter}
					//size='small'
					variant='outlined'
					margin='dense'
				/>
				</div>
				<Results state={state} data={data.filter(obj => filter.trim() === '' || obj.title.toLowerCase().includes(filter.toLowerCase()))} />

		</Typography>
	}
}

CountryList.propTypes = {
	classes: PropTypes.object,
	match: PropTypes.object.isRequired,
	history: PropTypes.any
};

export default withStyles(styles, { withTheme: true })(CountryList);
