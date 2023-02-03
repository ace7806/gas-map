import circle from '@turf/circle'
import gasStationIcon from './assets/gas-station-icon.png'


export const extractBestandOtherGasStations = (gasStationsGeoJson) => {
  //create a deep copy to not alter the source
  const deepCopy = JSON.parse(JSON.stringify(gasStationsGeoJson))
  const otherGasStations = deepCopy.features
  let lowestPrice = Number.MAX_VALUE;
  let indexes = [];

  // stores the indexes of the best priced gas stations 
  for (let i = 0; i < otherGasStations.length; i++) {
    const price = parseFloat(otherGasStations[i].properties.price);
    if (price == -1) continue

    if (price < lowestPrice) {
      lowestPrice = price;
      indexes = [i];
    } else if (price === lowestPrice) {
      indexes.push(i);
    }
  }

  //separates the best gas stations into their own list
  let lowestGasStations = []
  for (let i = 0; i < indexes.length; i++) {
    // Splice the element at the current index from the 'source' array and push it to 'lowestPriceStations'
    lowestGasStations.push(otherGasStations.splice(indexes[i] - i, 1)[0])

  }

  // wraps the best gas stations in a GeoJson format
  const newGeoJson = {
    'type': 'FeatureCollection',
    'features': lowestGasStations
  }

  return { 'bestGasStations': newGeoJson, 'otherGasStations': deepCopy };
}
export const sortGasStationsInPlace = (gasStationsGeoJson) => {
  gasStationsGeoJson.features.sort((a, b) => {
    if (a.properties.price == -1) return 1
    if (b.properties.price == -1) return -1
    return a.properties.price - b.properties.price;
  });
}
export const add_circle = (map, lng, lat, rad) => {
  const center = [lng, lat]
  const options = {
    steps: 64,
    units: 'miles'
  };
  const turf_circle = circle(center, rad, options);
  // Add a fill layer with some transparency.
  const circleSource = map.getSource('circle-location')
  if (circleSource) circleSource.setData(turf_circle)
  else {
    map.addLayer({
      id: "circle-location",
      type: "fill",
      source: {
        type: "geojson",
        data: turf_circle
      },
      paint: {
        "fill-color": "#8CCFFF",
        "fill-opacity": 0.2,
      }
    });
  }
}

export const add_gasStations = (map, data, highlight = false) => {
  if (map.hasImage('gas-station-icon') == false) {
    map.loadImage(gasStationIcon, (e, image) => {
      map.addImage('gas-station-icon', image);
    })
  }
  const source = map.getSource(highlight ? 'best-gas-stations-source' : 'gas-stations-source')
  if (source != null) source.setData(data)
  else {
    map.addSource(highlight ? 'best-gas-stations-source' : 'gas-stations-source', {
      'type': 'geojson',
      'data': data
    });

    map.addLayer({
      'id': highlight ? 'best-gas-stations-layer' : 'gas-stations-layer',
      'type': 'symbol',
      'source': highlight ? 'best-gas-stations-source' : 'gas-stations-source',
      'layout': {
        'icon-image': 'gas-station-icon',
        'icon-size': highlight ? 0.7 : 0.5,
        'text-field':
          ['format',
            ['get', 'price'],
            {
              'text-color': highlight ? 'green' : '#EB5B5B',
              'font-scale': highlight ? 1.3 : 1.1
            },
            ' ',
            ['get', 'name'],
          ],
        'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
        ],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      }
    });
  }
}