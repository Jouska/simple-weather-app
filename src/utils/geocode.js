const request = require('request')

// Geocoding
// ** Original, one use, non contained **


// const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1Ijoiam91c2thIiwiYSI6ImNrMWV5Z2V1dDBtOTEzbHBkejYyZGU4OHcifQ.1gADnppCUsKE_7B6IcWnsQ&limit=1'

// request({ url: geocodeURL, json: true }, (error, response) => {
//     if (error) {
//         console.log('Unable to connect to geolocation service')
//     } else if (response.body.features.length === 0) {
//         console.log('No Matching results')
//     } else {
//         const jsonParsed = response.body
//         const long = jsonParsed.features[0].center[0]
//         const lat = jsonParsed.features[0].center[1]
//         console.log('Longitude: ' + long + ' Latitude: ' + lat)
//     }
// })


// ** New version, multi-use, modular callback pattern version
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoiam91c2thIiwiYSI6ImNrMWV5Z2V1dDBtOTEzbHBkejYyZGU4OHcifQ.1gADnppCUsKE_7B6IcWnsQ&limit=1'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode