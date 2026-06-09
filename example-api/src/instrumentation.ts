import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { credentials } from "@grpc/grpc-js";
import { logs } from "@opentelemetry/api-logs";

const collectorEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317";

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "sarwam-api",
  [SEMRESATTRS_SERVICE_VERSION]: "0.1.0",
  "deployment.environment": process.env.NODE_ENV || "development",
});

// Set up log exporter explicitly
const logExporter = new OTLPLogExporter({
  url: collectorEndpoint,
  credentials: credentials.createInsecure(),
});

const loggerProvider = new LoggerProvider({ resource });
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
  resource,

  traceExporter: new OTLPTraceExporter({
    url: collectorEndpoint,
    credentials: credentials.createInsecure(),
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: collectorEndpoint,
      credentials: credentials.createInsecure(),
    }),
    exportIntervalMillis: 10_000,
  }),

  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },
      "@opentelemetry/instrumentation-http": {
        ignoreIncomingRequestHook: (req) => req.url === "/health",
      },
    }),
  ],
});

sdk.start();

process.on("SIGTERM", () => {
  loggerProvider.shutdown();
  sdk.shutdown();
});
process.on("SIGINT", () => {
  loggerProvider.shutdown();
  sdk.shutdown();
});
