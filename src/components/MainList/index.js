import React, {Component} from 'react';
import api from '../../api/methods';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import ArticleList from '../ArticleList';

const styles = theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200
		}
	},
	loadingPage: {
		display: 'flex',
		margin: '0 auto'
	},
	loadingPageWrapper: {
		position: 'fixed',
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		top: '0'
	},
	bodyWrapper: {
		margin: 25
	}
});

class MainList extends Component {
	state = {
		state: 'init',
		error: null,
		data: [],
		filter: '',
	}

	setData = async () => {
		this.setState({state: 'loading'});

		const {articles} = await api.tool.mainData();

		this.setState({
			data: articles,
			state: 'loaded'
		});
	}

	componentDidMount = () => {
		this.setData();
	}

	handleChange = event => {
		const { name, value } = event.target;

		this.setState({ [name]: value });
	};

	render = () => {
		const {state, data, updated, error, filter} = this.state;
		const {classes} = this.props;

		if (state === 'loading') {
			return <div className={classes.loadingPageWrapper}>
				<CircularProgress className={classes.loadingPage} />
			</div>
		}

		if (state === 'error') {
			return <Typography component='div' variant='body1' className={classes.bodyWrapper}>{`Error occurred: ${error}`}</Typography>;
		}

		if (data.length < 1) {
			return <Typography component='div' variant='body1' className={classes.bodyWrapper}>No data</Typography>;
		}

		return <Typography component='div' variant='body1' className={classes.bodyWrapper}>

				<TextField
					label='Filter'
					name='filter'
					onChange={this.handleChange}
					value={filter}
					//size='small'
					variant='outlined'
					margin='dense'
				/>
				<div style={{ marginTop: '10px' }} />
			<ArticleList list={data
				.filter(obj => filter.trim() === '' || obj.title.toLowerCase().includes(filter.toLowerCase()))} />
		</Typography>
	}
}

MainList.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(MainList);
