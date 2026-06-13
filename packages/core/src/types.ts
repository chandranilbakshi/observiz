export interface ObservizConfig {
  /** Name of your service. Required. */
  serviceName: string
  /** Service version. Defaults to "0.0.1" */
  serviceVersion?: string
  /** Deployment environment. Defaults to NODE_ENV or "development" */
  environment?: string
  /** OTel collector endpoint. Defaults to OTEL_EXPORTER_OTLP_ENDPOINT or "http://localhost:4317" */
  collectorUrl?: string
}
