import { useEffect, useState } from 'react'
import Station from './stations'
import { extractBestandOtherGasStations, sortGasStationsInPlace } from './utils'
import { getData } from './api'
import globalEventEmitter from './eventEmitter'
import Map from './map'
import Modal from './modal'
import './App.css'

function App() {
  // gas station objects are all wrapped as a GeoJson
  const [bestGasStations, setBestGasStations] = useState(null);
  const [otherGasStations, setOtherGasStations] = useState(null);

  const getGasStations = (lng, lat, rad) => {
    getData(lng, lat, rad).then((data) => {
      const { bestGasStations, otherGasStations } = extractBestandOtherGasStations(data);
      setBestGasStations(bestGasStations)
      sortGasStationsInPlace(otherGasStations)
      setOtherGasStations(otherGasStations)
    })
  }

  return (
    <div className="container">
      
      <div className="flex-1 overflow-auto ">
        <div className="form-control bg-slate-500" >
          <label className="label cursor-pointer">
            <span className="">super size search</span> 
            <input type="checkbox" onChange={()=>{globalEventEmitter.emit('super_size_search_toggle_event',{checked:  event.target.checked})}} className="checkbox checkbox-primary" />
          </label>
          </div>
        <div className='flex'>
          
          <div className='flex-1 text-left ml-4'>station name</div>
          <div className='flex-1 text-center'>price</div>
          <div className='flex-1 text-end mr-4'>idk</div>
        </div>

        {bestGasStations ? bestGasStations.features.map((gasStation) =>
          <Station highlight={true} gasStation={gasStation} />) : (<div />)}
        {otherGasStations ? otherGasStations.features.map(gasStation =>
          <Station gasStation={gasStation} />) : (<div />)}

        <Modal />
      </div>
      {<Map bestGasStations={bestGasStations} otherGasStations={otherGasStations} getGasStations={getGasStations} />}



    </div>
  )
}

export default App
