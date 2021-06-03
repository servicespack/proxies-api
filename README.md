# Node Proxy

![Banner](./assets/banner.png)

* Query param based
* Procted by [helmet](https://helmetjs.github.io/)

## Getting started

1. Clone repo and install dependencies

```bash
$ git clone https://github.com/gabrielrufino/node-proxy
$ cd node-proxy
$ npm ci
```

2. Setup environment

```bash
$ npm run dev:setup
```

3. Start service

```bash
$ npm run dev:start
```

## API

These are the routes of the proxy server. **They work with any HTTP method.**

### Ping route

> /

Response:

```json
{"I":"am alive"}
```

### Proxy route

> /proxy?url=www.google.com

Response: URL response

## LICENSE

MIT
