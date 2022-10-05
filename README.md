# Node Proxy

![Banner](./assets/banner.png)

* Reverse proxy
* Create proxies dynamically
* Prometheus metrics
* Procted by [helmet](https://helmetjs.github.io/)
* Graceful Shutdown

## Getting started

1. Clone repo and install dependencies

```bash
git clone https://github.com/gabrielrufino/node-proxy
cd node-proxy
npm ci
```

2. Setup environment

```bash
npm run dev:setup
```

3. Start service

```bash
npm run dev:start
```

## API

These are the routes of the proxy server.

### Ping route

> GET /health

Response:

```json
{"I":"am alive"}
```

### Create a proxy

> POST /proxies

```json
{
  "namespace": "users",
  "target": "https://users.yourmicroservices.dev"
}
```

## LICENSE

MIT
