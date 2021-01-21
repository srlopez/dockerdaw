//const os = require('os')
const fetch = require('cross-fetch');

const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

const innerhost = process.env.INNERAPIHOST || "localhost:7000"
const innerapiusers = 'http://'+innerhost+'/api/v1/users'

const host = process.env.PUBLICAPIHOST || "localhost:7000"
const apiusers = 'http://'+host+'/api/v1/users'



const port = process.argv[2] || 7077 
var server = app.listen(process.env.PORT || port, () => {
  console.log('webapp listening on ' + server.address().port)
})

// ==========  HOME ===========
app.get('/', (req, res) => {
  console.log( 'retrieving ' + apiusers + '. . .' )

  fetch( innerapiusers, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    //console.log(response)
    if (response.ok) return response.json()
  })
  .then(data => {
    //console.log(data)
    res.render('index.ejs', {
      users: data,
      api: apiusers
    })
  })
})

// ======  TODAS LAS DEMAS RUTAS =====
// app.get('*', (req, res) => {
//   ASí obliga y pasa dos veces por /, mal hecho
//   res.redirect(301, '/')
// })
