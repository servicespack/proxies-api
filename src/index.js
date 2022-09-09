'use strict'

const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const proxy = require('express-http-proxy')

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(helmet())
app.use(cors())
app.all('/', (_request, response) => response.json({ I: 'am alive' }))
app.all(
  '/proxy',
  (request, _, next) => {
    console.log(`[Node Proxy] Request from ${request.socket.remoteAddress}`)
    next()
  },
  proxy((request) => request.query.url)
)

app.listen(PORT, () => console.log(`[Node Proxy] Listening on ${PORT}`))
