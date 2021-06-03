'use strict'

const express = require('express')
const helmet = require('helmet')
const proxy = require('express-http-proxy')

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv')
  dotenv.config()
}

const { PORT } = process.env

const app = express()

app.use(helmet())
app.use(cors())
app.all('/', (_request, response) => response.json({ I: 'am alive' }))
app.use('/proxy', proxy((request) => request.query.url))

app.listen(PORT, () => console.log(`[Node Proxy] Listening on ${PORT}`))
