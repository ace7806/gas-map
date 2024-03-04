import React, { useRef, useEffect, useState } from 'react';
import config from '../config';
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
  const NORMAL_RAD = 6;
  const SUPER_RAD = 12;
  const [rad,setRad] = useState(NORMAL_RAD)

  useEffect(() => {
    if (map.current) return;
    // initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${config}`,
      center: [-65.15, 17],
      zoom: 4,
      maxBounds: [[-70.3503, 16.8637], [-63.27647, 19.49178]]
    });

    // listen to new coords to move to. 
    globalEventEmitter.on('view_station_event', (data) => {
      console.log(data);
      setLng(data.lng)
      setLat(data.lat)
    });
    // listen to super search checkbox event and update radius accordingly 
    globalEventEmitter.on('super_size_search_toggle_event', (data) => {
      setRad(data.checked? SUPER_RAD:NORMAL_RAD)
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

  // moves the map towards the gas station that the user clicked 
  useEffect(() => {
    if (!map.current) return
    map.current.flyTo({ center: [lng, lat], zoom: zoom });
  }, [lng, lat])

  // update click listener every time super sized search is toggled
  useEffect(() => {
    // if (map.current) return
    // query gas stations every time a user clicks on the map
    map.current.on('click', function (e) {
      const [long, latitude] = e.lngLat.toArray()
      console.log(long, latitude);
      getGasStations(long, latitude, rad)
      add_circle(map.current, long, latitude, rad)
    });
  }, [rad])
    
  // add's gas stations to map data source
  useEffect(() => {
    if (!map.current || !bestGasStations || !otherGasStations) return
    add_gasStations(map.current, bestGasStations, true)
    add_gasStations(map.current, otherGasStations)
  }, [bestGasStations, otherGasStations])


  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className='absolute top-1 left-1 text-xs opacity-50 '>
        PR gas map by Sebastian
      </div>
    </div>
  );
}