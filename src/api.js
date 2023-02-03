import axios from 'axios';
// for testing purposes
const dummySource = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            "properties": {
                "price": "92.7",
                "name": "Shell"
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [62, 24.8]
            }
        },
        {
            'type': 'Feature',
            "properties": {
                "pricePerLiter": "89.7",
                "name": "Puma"
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [45, 14]
            }
        }
    ]
}


export const getData = async (lng, lat, rad) => {
    const serverOn = true
    // these urls are for me; for when im testing between my laptop or phone since flask servers are problematic lol
    const onlineServer = 'http://150.230.170.110:5000/'
    const localFLaskURL = 'http://127.0.0.1:5000/'
    try {
        const response = serverOn ? await axios.get(onlineServer, {
            params: {
                lng: lng,
                lat: lat,
                rad: rad
            }
        }) : { 'data': dummySource };
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
