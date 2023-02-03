import React from 'react';
import globalEventEmitter from './eventEmitter';
import gasStationIcon from './assets/gas-station-icon.png'

export default function Station({ highlight, gasStation }) {
  const { name, price } = gasStation.properties
  const [lng, lat] = gasStation.geometry.coordinates
  const handleClick = () => {
    globalEventEmitter.emit('view-station-event', { lng: lng, lat: lat });
  };
  return (
    <button onClick={handleClick} className='btn btn-block btn-ghost text-base flex justify-end my-4 '>
      <div className={highlight ? 'flex-1 text-left text-green-800' : 'flex-1 text-left overflow-clip'}>{name.length > 15 ? name.substring(0, 15) + "..." : name}</div>
      <div className={highlight ? 'flex-1 text-center text-green-800' : 'flex-1 text-center'}> {price == -1 ? 'dont know :(' : price} </div>
      <img className=' flex-1 self-end mb-4 h-6 w-6 object-contain' src={gasStationIcon}></img>
    </button>
  );
};

