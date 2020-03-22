import React from 'react';
import Typography from '@material-ui/core/Typography';
import ArticleList from '../ArticleList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
});

const resultSection = ({state, data, filter}) => {
	console.log(state, data);
	const classes = useStyles();

	if (state === 'init') {
		return '';
	}

	if (state === 'loading') {
		return <div className={classes.loadingPageWrapper}>
			<CircularProgress className={classes.loadingPage} />
		</div>
	}

	if (state === 'error') {
		return <Typography component='div' variant='body1'>{`Error occurred: ${error}`}</Typography>;
	}

	if (!data) {
		return 'EEEEEEE';
	}

	if (data.length < 1) {
		return <Typography component='div' variant='body1'>No data</Typography>;
	}

	if (data.length > 0) {
		return <ArticleList list={data} />;
	}
}


export default resultSection;
