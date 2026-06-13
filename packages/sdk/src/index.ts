import { initTraces } from "@observiz/traces"
import { initLogs } from "@observiz/logs"
import { initMetrics } from "@observiz/metrics"
import type { ObservizConfig } from "@observiz/core"

export type { ObservizConfig } from "@observiz/core"
export { initTraces } from "@observiz/traces"
export { initLogs, getLogger } from "@observiz/logs"
export { initMetrics, getMeter } from "@observiz/metrics"

export function initObserviz(config: ObservizConfig): void {
  initTraces(config)
  initLogs(config)
  initMetrics(config)
}
