import {get, post } from './api';

const tool = {
    mainData: () => get('', { act: 'get_main_list' }),
    updated: () => get('', { act: 'updated' }),
	countries: () => get('', { act: 'countries' }),
	mapData: () => get('', { act: 'map_data' }),
	countryData: ({country, category}) => get('', { act: 'country', val: country, sub: category })
}

const apiWrapper = {
    tool
}

export default apiWrapper;
