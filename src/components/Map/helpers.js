import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector.js';
import {Cluster, Vector as VectorSource} from 'ol/source.js';

import {Tile as TileLayer} from 'ol/layer.js';
import OSM from 'ol/source/OSM.js';

var image = new CircleStyle({
	radius: 5,
	fill: null,
	stroke: new Stroke({color: 'red', width: 3})
});

export var styles = {
	'Point': new Style({
	  image: image
	}),
	'LineString': new Style({
	  stroke: new Stroke({
		color: 'red',
		width: 1
	  })
	}),
	'MultiLineString': new Style({
	  stroke: new Stroke({
		color: 'red',
		width: 1
	  })
	}),
	'MultiPoint': new Style({
	  image: image
	}),
	'MultiPolygon': new Style({
	  stroke: new Stroke({
		color: 'red',
		width: 1
	  }),
	  fill: new Fill({
		color: 'rgba(255, 255, 0, 0.1)'
	  })
	}),
	'Polygon': new Style({
	  stroke: new Stroke({
		color: 'red',
		lineDash: [4],
		width: 3
	  }),
	  fill: new Fill({
		color: 'rgba(0, 0, 255, 0.1)'
	  })
	}),
	'GeometryCollection': new Style({
	  stroke: new Stroke({
		color: 'red',
		width: 2
	  }),
	  fill: new Fill({
		color: 'red'
	  }),
	  image: new CircleStyle({
		radius: 10,
		fill: null,
		stroke: new Stroke({
		  color: 'red'
		})
	  })
	}),
	'Circle': new Style({
	  stroke: new Stroke({
		color: 'red',
		width: 2
	  }),
	  fill: new Fill({
		color: 'rgba(255,0,0,0.2)'
	  })
	})
};

/* var clusterSource = new Cluster({
	distance: parseInt(40, 10),
	//source: source
  }); */

export var geojsonObject = (objects) => ({
	'type': 'FeatureCollection',
	'crs': {
	  'type': 'name',
	  'properties': {
		'name': 'EPSG:3857'
	  }
	},
	'features': objects
});

/* var styleCache = {};
export var clusters = new VectorLayer({
  source: clusterSource,
  style: function(feature) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff'
          }),
          fill: new Fill({
            color: '#3399CC'
          })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff'
          })
        })
      });
      styleCache[size] = style;
    }
    return style;
  }
}); */


//const vectorSource = (features) =>

export const vectorLayer = (features, stylefunc) => new VectorLayer({
	source: new VectorSource({features}),//vectorSource(features),
	style: stylefunc// styleFunction
});

export const wmsLayer = new TileLayer({
	source: new OSM({wrapX: false,
		noWrap: true})
});

export function centerOnFeatures(myLayer, map, padding) {
    //	var pan = ol.animation.pan({duration: 500, source: map.getView().getCenter()})
    //	var zoom = ol.animation.zoom({duration: 500, resolution: map.getView().getResolution()})
    //	map.beforeRender(pan, zoom);

    //https://stackoverflow.com/questions/20816663/openlayers-3-extent-of-all-features-on-a-vector-layer
        var view = map.getView();
        var zoom = 14;
        if(map.getView().getZoom() > 14) {
            zoom = map.getView().getZoom();
        }
        const duration = 500;

        //const featureToFit = arrFeatures[0].getGeometry();

        const extent = myLayer.getSource().getExtent();

        view.fit(extent, {padding: padding, maxZoom: zoom, duration: duration});
        //view.fit(extent, { constrainResolution: false });
}
