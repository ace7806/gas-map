import { useEffect, useState } from 'react'
import Station from './stations'
import { extractBestandOtherGasStations, sortGasStationsInPlace } from './utils'
import { getData } from './api'
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
      sortGasStationsInPlace(otherGasStations)
      setBestGasStations(bestGasStations)

      setOtherGasStations(otherGasStations)
    })
  }


  return (
    <div className="container">
      <div className="flex-1 overflow-auto ">
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
