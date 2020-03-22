
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
	  width: 500
	},
	option: {
	  fontSize: 15,
	  '& > span': {
		marginRight: 10,
		fontSize: 18,
	  },
	},
});

export default function CountrySelect({options, onChange, name, value, setPendingValue, label, disabled}) {
	const classes = useStyles();
	console.log('disabled', name, disabled)

	return (
	  <Autocomplete
		id="country-select-demo"
		style={{ width: 500 }}
		options={options}
		classes={{
		  option: classes.option,
		}}
		autoHighlight
		getOptionLabel={option => option}
		renderOption={option => (
		  <React.Fragment>
			{option}
		  </React.Fragment>
		)}

		onChange={(event, newValue) => {
            setPendingValue(newValue);
          }}
		renderInput={params => (
		  <TextField
			{...params}
			label={label}
			name={name}
			disabled={disabled}
			onChange={onChange}
			//size='small'
			variant='outlined'
			margin='dense'
			inputProps={{
			  ...params.inputProps,
			  disabled: disabled,
			  //value: value,
			  //minWidth: '300px',
			  autoComplete: 'new-password', // disable autocomplete and autofill
			}}
		  />
		)}
	  />
	);
}
