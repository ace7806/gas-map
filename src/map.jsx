import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import globalEventEmitter from './eventEmitter';
import { add_circle, add_gasStations } from './utils';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map({ bestGasStations, otherGasStations, getGasStations }) {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-66.5);
  const [lat, setLat] = useState(18.33);
  const [zoom, setZoom] = useState(9);
  const [API_KEY] = useState('get_your_own_OpIi9ZULNHzrESv6T2vL');
  const SEARCH_RADIUS = 4



  useEffect(() => {
    if (!map.current) return
    map.current.flyTo({ center: [lng, lat], zoom: zoom });
  }, [lng, lat])

  useEffect(() => {
    if (!map.current || !bestGasStations || !otherGasStations) return
    add_gasStations(map.current, bestGasStations, true)
    add_gasStations(map.current, otherGasStations)
  }, [bestGasStations, otherGasStations])

  useEffect(() => {
    if (map.current) return;
    globalEventEmitter.on('view-station-event', (data) => {
      console.log(data);
      setLng(data.lng)
      setLat(data.lat)
    });

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [-65.15, 17],
      zoom: 4,
      maxBounds: [[-70.3503, 16.8637], [-63.27647, 19.49178]]
    });

    map.current.on('click', function (e) {
      const [lng, lat] = e.lngLat.toArray()
      console.log(lng, lat);
      getGasStations(lng, lat, SEARCH_RADIUS)
      add_circle(map.current, lng, lat, SEARCH_RADIUS)
    });

    // Add geolocate control to the map.
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
    // After the initial zoom on map load the next time the map zooms in a position like a gas station, it will be much closer
    setZoom(17)
  }, []);




  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}