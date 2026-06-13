import { Resource } from "@opentelemetry/resources"
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from "@opentelemetry/semantic-conventions"
import type { ObservizConfig } from "./types.js"

export function createResource(config: ObservizConfig): Resource {
  return new Resource({
    [SEMRESATTRS_SERVICE_NAME]: config.serviceName,
    [SEMRESATTRS_SERVICE_VERSION]: config.serviceVersion ?? "0.0.1",
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: config.environment ?? process.env.NODE_ENV ?? "development",
  })
}

export function resolveCollectorUrl(config: ObservizConfig): string {
  return (
    config.collectorUrl ??
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    "http://localhost:4317"
  )
}
