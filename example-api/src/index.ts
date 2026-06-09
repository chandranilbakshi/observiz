// instrumentation MUST be first — before any other imports
import "./instrumentation";

import express from "express";
import { trace, metrics, context } from "@opentelemetry/api";

const app = express();
app.use(express.json());

const tracer = trace.getTracer("sarwam-api");
const meter  = metrics.getMeter("sarwam-api");

// Custom metrics
const httpRequestCounter = meter.createCounter("http_requests_total", {
  description: "Total HTTP requests",
});
const activeOrdersGauge = meter.createObservableGauge("active_orders", {
  description: "Number of active orders in flight",
});

// Simulate active orders
let activeOrders = 0;
activeOrdersGauge.addCallback((result) => result.observe(activeOrders));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/orders", async (req, res) => {
  httpRequestCounter.add(1, { method: "GET", route: "/orders" });

  // Create a manual child span for the DB call
  const span = tracer.startSpan("db.query.orders");
  try {
    activeOrders++;
    await new Promise((r) => setTimeout(r, Math.random() * 80 + 20)); // simulate DB
    span.setAttributes({ "db.system": "postgresql", "db.rows_returned": 12 });
    res.json({ orders: [], count: 12 });
  } catch (err) {
    span.recordException(err as Error);
    span.setStatus({ code: 2, message: (err as Error).message });
    res.status(500).json({ error: "internal" });
  } finally {
    activeOrders--;
    span.end();
  }
});

app.listen(Number(process.env.PORT) || 3001, () => {
  console.log(JSON.stringify({
    level: "info",
    message: "API started",
    port: process.env.PORT || 3001,
    trace_id: "startup",  // Loki's derivedFields regex will pick up trace_id from JSON logs
  }));
});
