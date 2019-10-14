
const request = require('request')

//** OLD forecast request, non-reusable, no callback pattern */
// const url = 'https://api.darksky.net/forecast/ba6737df6f2e2f306ec38a64f42c4840/37.8267,-122.4233?units=si'

// request({ url: url, json: true }, (error, response) => {
//     if (error) {
//         console.log('Unable to connect to weather service')
//     } else if (response.body.error) {
//         console.log('Unable to find location')
//     } else {
//         const temp = response.body.currently.temperature
//         const precipProb = response.body.currently.precipProbability
    
//         console.log(response.body.daily.data[0].summary + ' It is currently ' +  temp + ' degrees out. There is ' + precipProb + '% chance of rain.')
//     }
// })

// ** NEW forecast request as function, callback pattern to allow re-use
const forecast = (long, lat, callback) => {
    const url = 'https://api.darksky.net/forecast/ba6737df6f2e2f306ec38a64f42c4840/' + long + ', ' + lat + '?units=si'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const temp = body.currently.temperature
            const precipProb = body.currently.precipProbability
    
            const message = body.daily.data[0].summary + ' It is currently ' +  temp + ' degrees out. There is ' + precipProb + '% chance of rain.'
            callback(undefined, message)
        }
    })
}

module.exports = forecast