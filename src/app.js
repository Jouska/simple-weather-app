const path = require('path')
// Path is a built in nodejs core module, supports in directory path controls
const express = require('express')
const hbs = require('hbs')
// Load geocode and forecast util functions
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Load up express function into app
const app = express()
const port = process.env.PORT || 3000

// Must use ABSOLUTE path to serve up public folder with public assets, rather than relative (ie '../')
// console.log(__dirname)
// Use path.join method to create absolute path to public directory, so that express can in turn serve it
// console.log(path.join(__dirname, '../public'))
// __dirname is a built-in node variable to return current directory path
const publicDirectoryPath = path.join(__dirname, '../public')

// Create custom path for views folder and partials folder. Updating default express settings
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set default view engine (handlebars - express version) and views location, AND partials location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Customise what server serves, use express method to serve public folder (for css, js, images)
app.use(express.static(path.join(publicDirectoryPath)))

// Get route, callback with request from client and response from us
app.get('', (req, res) => {
    // Send something back using response argument, plus send method
    // In this case, the handlebars view file
    // use RENDER() to render views, rather than send
    // Send an object as a second argument containing extra values to send to template file (index.hbs)
    res.render('index', {
        title: 'Weather App',
        name: 'Tom'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Tom'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Tom',
        message: 'You want some help buddy?'
    })
})

// Create Weather HTTP JSON endpoint
app.get('/weather', (req, res) => {
    
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    } 

    let address = req.query.address

    // Run Geocode function, passing in query address
    // Add default empty object to geocode destructured second argument, in case object is not returned
    // Which will allow error argument to pass
    geocode(address, (error, { longitude, latitude, location } = {} ) => {
        // Check for error response from geocode API
        if (error) {
            return res.send({
                error
            })
        }
        // If all good, feed longitude and latitude into forecast function
        forecast(longitude, latitude, (error, forecastData) => {
            // Check for error response from forecast API
            if (error) {
                return res.send({
                    error
                })
            }
            // Else, send back forecast and location
            res.send({
                forecast: forecastData,
                location,
                address
            })
        })

    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

// Matches any page following /help/ ... (for specific 404s)
app.get('/help/*', (req, res) => {
    res.render('404', {
        error404: 'Help article not found',
        name: 'Tom',
        title: '404'
    })
})

// Wildcard (asterisk) must be last, as it matches everything! In other words, if '/weather' was put afterwards
//the wildcard would be activated first..
app.get('*', (req, res) => {
    res.render('404', {
        error404: 'Page not found',
        name: 'Tom',
        title: '404'
    })
})

// Routes vvv
// app.com -- Hello express!
// app.com/help
// app.com/about

// Start server up using listen method, using 3000 port (only works on local)
// Plus callback to launch when server is listening
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})