import { initObserviz } from "@observiz/sdk"

initObserviz({
  serviceName: process.env.OTEL_SERVICE_NAME ?? "example-api",
  environment: process.env.NODE_ENV ?? "development",
})
