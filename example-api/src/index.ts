import "./instrumentation.js";
import express from "express";
import { getLogger, getMeter } from "@observiz/sdk"
import { trace } from "@opentelemetry/api"

const logger = getLogger()
const tracer = trace.getTracer("example-api")
const meter  = getMeter("example-api")

const app = express();
app.use(express.json());

const httpRequestCounter = meter.createCounter("http_requests_total", {
  description: "Total HTTP requests",
});

const activeOrdersGauge = meter.createObservableGauge("active_orders", {
  description: "Number of active orders in flight",
});

let activeOrders = 0;
activeOrdersGauge.addCallback((result) => result.observe(activeOrders));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/orders", async (req, res) => {
  httpRequestCounter.add(1, { method: "GET", route: "/orders" });

  const span = tracer.startSpan("db.query.orders");
  try {
    activeOrders++;
    await new Promise((r) => setTimeout(r, Math.random() * 80 + 20));
    span.setAttributes({ "db.system": "postgresql", "db.rows_returned": 12 });
    logger.info("orders fetched", { route: "/orders", count: 12 });
    res.json({ orders: [], count: 12 });
  } catch (err) {
    span.recordException(err as Error);
    logger.error("orders fetch failed", { error: (err as Error).message });
    res.status(500).json({ error: "internal" });
  } finally {
    activeOrders--;
    span.end();
  }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  logger.info("API started", { port: PORT });
});
