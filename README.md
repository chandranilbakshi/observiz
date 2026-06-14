# Observiz

Self-hosted observability stack for Node/Bun APIs. Spin up a full LGTM stack (Loki, Grafana, Tempo, Prometheus) with OpenTelemetry in one command — no Datadog bill, no data leaving your infrastructure.

## What's included

- **OpenTelemetry Collector** — central pipeline that receives traces, metrics, and logs from your API
- **Grafana Tempo** — distributed trace storage with per-request timelines
- **Grafana Loki** — structured log storage, queryable like a database
- **Prometheus** — metrics storage with RED metrics auto-derived from traces
- **Grafana** — unified dashboard with trace↔log correlation wired up out of the box

## Prerequisites

- Docker and Docker Compose

## Getting started

**1. Clone the repo:**
```bash
git clone https://github.com/chandranilbakshi/observiz
cd observiz
```

**2. Start the stack:**
```bash
docker compose up -d
```

**3. Open Grafana:**

Navigate to `http://localhost:3000` — all datasources are pre-configured, no manual setup needed.

## Instrument your API

Install the SDK in your Node or Bun API:

```bash
npm install @observiz/sdk
```

Add one line to your entry point (before any other imports):

```typescript
import { initObserviz } from "@observiz/sdk"

initObserviz({ serviceName: "my-api" })
```

Set the collector URL via environment variable:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

Your traces, logs, and metrics will start flowing into Grafana immediately.

→ See the full SDK documentation at [observiz-sdk](https://github.com/chandranilbakshi/observiz-sdk)

## Ports

| Service | Port |
|---|---|
| Grafana | 3000 |
| Loki | 3100 |
| Tempo | 3200 |
| Prometheus | 9090 |
| OTel Collector (gRPC) | 4317 |
| OTel Collector (HTTP) | 4318 |

## Querying your data in Grafana

**Traces** — Explore → Tempo → Search → filter by service name

**Logs** — Explore → Loki → query `{job="your-service-name"}`

**Metrics** — Explore → Prometheus → query `http_requests_total`

Clicking a trace ID inside a log line jumps directly to the full trace in Tempo. Clicking an exemplar in Prometheus jumps to the corresponding trace.

## Production deployment

For production, replace the local volume storage with object storage:

- Tempo and Loki both support S3, GCS, and Azure Blob as backends
- Update `tempo/tempo.yml` and `loki/loki.yml` with your storage config
- Set `GF_AUTH_ANONYMOUS_ENABLED=false` in `docker-compose.yml` and configure Grafana auth

## License

MIT
