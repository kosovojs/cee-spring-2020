import React from 'react';
import { withStyles, useStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
	col3: {
		columnCount: 1,

		[theme.breakpoints.up('sm')]: {
			columnCount: 2
		},
		[theme.breakpoints.up('md')]: {
			columnCount: 3
		}
	},
	removedUnderline: {
		textDecoration: 'none'
	}
});


const ArticleList = ({ list, classes }) => {
	//const classes = {};//useStyles();

	return (
		<div className={classes.col3}>
			<ul>
				{list.map(item => {
					const {title, wiki, iws, countries, wikidata} = item;

					return (
						<li key={wikidata}>
							<a
								className={classes.removedUnderline}
								href={`https://${wiki}.wikipedia.org/wiki/${title}`}
								rel="noopener noreferrer"
								target='_blank'>
								{title.replace(/_/g, ' ')}
							</a> {countries && <small>({countries})</small>}
							: {iws}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

ArticleList.propTypes = {
	classes: PropTypes.object,
	list: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(ArticleList);
