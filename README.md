# Observability Stack

A self-hosted observability stack for experimenting with **traces, metrics, and logs** using Docker Compose.

This project is a work in progress and currently serves as a testing ground for building a reusable observability setup for API-based applications.

## What’s included

- **OpenTelemetry Collector** — receives telemetry from the API and routes it onward
- **Tempo** — stores distributed traces
- **Loki** — stores and queries logs
- **Prometheus** — stores metrics
- **Grafana** — visualizes and correlates all signals
- **Example API** — a small instrumented service used to verify the integration end to end

## Project structure

```text
observability-stack/
├── docker-compose.yml
├── otel-collector/
│   └── config.yaml
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasources.yaml
│   │   └── dashboards/
│   │       └── dashboards.yaml
│   └── dashboards/
│       └── api-overview.json
├── prometheus/
│   └── prometheus.yml
├── tempo/
│   └── tempo.yaml
├── loki/
│   └── loki.yaml
├── example-api/
│   ├── src/
│   │   ├── index.ts
│   │   └── instrumentation.ts
│   ├── package.json
│   └── Dockerfile
└── README.md
```

## Current status

This repository is **not a production-ready platform yet**.

Right now, it is mainly used to:

- test OTel instrumentation
- verify telemetry flow through the stack
- explore how to make the setup reusable for other API projects

## How it works

The example API exports telemetry through OpenTelemetry to the collector.
From there:

- traces go to **Tempo**
- metrics go to **Prometheus**
- logs go to **Loki**

Grafana is configured to connect to all three so you can jump between logs, metrics, and traces.

## Running the stack

1. Make sure Docker and Docker Compose are installed.
2. Start the stack:

```bash
docker compose up --build
```

3. Open Grafana:

- `http://localhost:3000`

4. The example API should be available at:

- `http://localhost:3001`

## Example API

The `example-api` service is intentionally simple. It exists to confirm that observability integration is working before adapting the setup for other projects.

## Next steps

Planned improvements include:

- making the instrumentation easier to reuse in other API projects
- supporting more frameworks or app structures
- improving documentation and setup instructions
- cleaning up the demo API into a more reusable integration example

## Notes

This repo is being built in public, so the setup may change as the project evolves.
