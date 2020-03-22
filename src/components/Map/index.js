import React, { Component } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {fromLonLat} from 'ol/proj';
import api from '../../api/methods';
import './map-style.css';


import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import {Style} from 'ol/style.js';

import GeoJSON from 'ol/format/GeoJSON.js';
import 'ol/ol.css';

import { defaults as defaultControls, Attribution } from 'ol/control';

import Overlay from 'ol/Overlay';

import {centerOnFeatures, geojsonObject, wmsLayer, vectorLayer, styles} from './helpers';

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new Overlay({
    element: container,
    autoPan: false,
    autoPanAnimation: {
        duration: 250
    }
});

let featureLayer = null;

var styleFunction = function(feature) {
	//var style = new Style({});
	var iwCount = feature.get('iws');

	if (iwCount > 10 && iwCount < 20) {
		return styles[feature.getGeometry().getType()];
	}
	//console.log(iwCount)
	/*
	if (id && collectionList.includes(id) {
		style = new Style({
			stroke: new Stroke({
				color: #000,
				width: 1
			})
		});
	} */
	return new Style({});

	/* return styles[feature.getGeometry().getType()]; */
};

export default class MapObject extends Component {
	state = {
		iws: [35, 50]
	}

	setup = async () => {
		const data = await api.tool.mapData();

		let objects = data.map(object => {
			return {
				"type": "Feature",
				"properties": object,
				"geometry": {
				  "type": "Point",
				  "coordinates": object.coords.map(coor => parseFloat(coor)).reverse()
				}
			  }
		})

		const features = (new GeoJSON()).readFeatures(geojsonObject(objects), {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});//

		featureLayer = vectorLayer(features, styleFunction);

		const map = new Map({
			layers: [wmsLayer,featureLayer],//clusters
			target: 'map',
			view: new View({
			  center: fromLonLat([14.941406,50.035974]),
			  zoom: 5
			}),
			overlays: [overlay]
		});

		map.on('click', function(evt) {
			displayFeatureInfo(evt.pixel);
		});

		const displayFeatureInfo = pixel => {
			featureLayer.getFeatures(pixel).then(function(features) {
				var feature = features.length ? features[0] : undefined;
				if (feature) {
					const {iws, title, wiki} = feature.values_;
					content.innerHTML = `<h3>${title} (${iws})</h3><a rel="noopener noreferrer" href="https://${wiki}.wikipedia.org/wiki/${title}" target="_blank">Raksts ${wiki}wiki</a>`;
					overlay.setPosition(feature.getGeometry().flatCoordinates);
				}
			});
		};

		//centerOnFeatures(vectorLayer(features),map);

		const removePopup = () => {
			overlay.setPosition(undefined);
			closer.blur();
			return false;
		};

		closer.onclick = function() {
			removePopup();
		};
	}

	componentDidMount() {
		this.setup();
	}

	updStyle = (min, max) => {
		console.log('fsdf')

		const newStylre = function(feature) {
			//var style = new Style({});
			var iwCount = feature.get('iws');

			if (iwCount > min && iwCount < max) {
				return styles[feature.getGeometry().getType()];
			}
			//console.log(iwCount)
			/*
			if (id && collectionList.includes(id) {
				style = new Style({
					stroke: new Stroke({
						color: #000,
						width: 1
					})
				});
			} */
			return new Style({});

			/* return styles[feature.getGeometry().getType()]; */
		};
//then redraw the layer
featureLayer.setStyle(newStylre);
	}

	handleChange = (event, newValue) => {
		this.setState({iws: newValue}, () => this.updStyle(...newValue))
	}

  	render() {
		  const {iws} = this.state;

		return <div>
			<div id="map" style={{width:'100%',height: '80vh'}}>
				<div id="iw-filter">
				<Typography id="range-slider" gutterBottom>
  iw range
</Typography>
<Slider
  value={iws}
  onChange={this.handleChange}
  valueLabelDisplay="auto"
  aria-labelledby="range-slider"
  getAriaValueText={value => value}
/>
				</div>
			</div>
		</div>;
	}
}
