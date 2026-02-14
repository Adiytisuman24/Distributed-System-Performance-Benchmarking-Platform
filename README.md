# Distributed System Performance Benchmarking Platform 🚀

A production-grade distributed systems lab for load testing, bottleneck discovery, and metrics-driven performance optimization at scale.

This project demonstrates real-world large-scale backend engineering by designing, testing, breaking, and optimizing a multi-tier distributed system under extreme load — with full observability and failure analysis.

---

## 🎯 Why This Project Exists
Modern backend systems do not fail functionally — they fail under load. This platform is built to answer hard engineering questions:
- **Where does my system break first?**
- **What limits throughput at scale?**
- **Why does P99 latency explode?**
- **How do async queues, caches, DBs, and GC interact under pressure?**
- **How do I prove optimizations with metrics?**

This repository is not a demo app — it is a **performance engineering laboratory**.

---

## 🧠 What This Proves (At a Glance)
- ✅ Large-scale distributed system design
- ✅ Load, stress, soak & chaos testing
- ✅ P99 latency & throughput analysis
- ✅ Async processing & backpressure
- ✅ Metrics-first optimization mindset
- ✅ Production observability discipline

---

## 🏗️ High-Level Architecture
```text
┌──────────────────────┐
│      Next.js UI      │
│  (Dashboards + Ops)  │
└─────────▲────────────┘
          │ WebSockets / REST
┌─────────┴────────────┐
│  API Gateway Layer   │
│  Java (Spring Boot)  │
│  Reactive / Non-IO   │
└─────────▲────────────┘
          │
 ┌────────┼────────┐
 │        │        │
 │        │        │
▼        ▼        ▼
Redis   Kafka   PostgreSQL
(Cache) (Async) (Persistence)
 │        │        │
 └────────┴────────┴──────┐
                           ▼
                 Prometheus Metrics
                           ▼
                      Grafana
```

---

## 🧩 System Components

### 🖥️ Frontend (Visualization & Control Plane)
- **Tech**: Next.js (App Router), Recharts, WebSocket streaming.
- **Responsibilities**:
  - Real-time performance dashboards.
  - Triggering load tests & chaos scenarios.
  - Visualizing P50 / P95 / P99 latency.
  - Observing CPU, memory, GC, queue depth.

### ⚙️ Core Backend (Performance-Critical Tier)
- **Primary API**: Java (Spring Boot / WebFlux).
  - Reactive, non-blocking I/O.
  - Resilience4j (Rate Limiting & Circuit Breakers).
  - Metrics-first instrumentation with Micrometer.
- **Auxiliary Services**: Node.js.
  - Load-test orchestration & Result aggregation.

### 🗄️ Database Layer (Persistence Under Load)
- **Tech**: PostgreSQL.
- **Used For**: Test metadata, aggregated results, and historical analysis.
- **Stress Points**: Read/write separation testing, slow query analysis.

### ⚡ Cache Layer (Latency Optimization)
- **Tech**: Redis.
- **Responsibilities**: Hot-path caching, rate limit counters, session data.

### 🔄 Async & Event-Driven Processing
- **Tech**: Apache Kafka.
- **Why?**: Decouples ingestion from processing, models real-world async systems, exposes queue depth metrics.

---

## 🔧 Performance Engineering Scope

### 🔥 Load & Stress Testing
- **Tools**: Locust (Python), JMeter (compatible).
- **Test Types**: High-throughput load, spikes, soak tests, and breaking point discovery.

### 💣 Intentional Failure Injection
This system is designed to break on purpose:
- **Artificial DB latency**: Inject sleep in SQL execution.
- **Kafka consumer slowdown**: Simulate processing lag.
- **Redis eviction pressure**: Saturate memory to force cache misses.
- **CPU throttling**: Simulate resource starvation.

---

## 📊 Observability (Non-Negotiable)
- **Monitoring Stack**: Prometheus + Grafana.
- **Tracked Metrics**: RPS, P99 Latency, JVM GC pauses, CPU/Memory, Kafka Lag, Redis Hit Ratio, DB Latency.

---

## 🏛️ C4 Model Diagrams

### C1 – System Context
```text
┌──────────────────────────────┐
│          Engineers           │
│  (Developers / SRE / QA)     │
└─────────────▲────────────────┘
              │
              │ Web UI / Metrics
              ▼
┌────────────────────────────────────────────────┐
│ Distributed Performance Benchmarking Platform  │
│                                                │
│ • Load testing                                 │
│ • Failure injection                            │
│ • Bottleneck discovery                         │
│ • Metrics-driven optimization                  │
└────────────────────────────────────────────────┘
              ▲
              │
              │ Load generators
              ▼
      JMeter / Locust Clients
```

### C2 – Container Diagram
```text
┌──────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                        │
│   Dashboards • Chaos Controls • Live Metrics Visualization   │
└──────────────────────────────▲───────────────────────────────┘
                               │ REST / WebSocket
┌───────────────────────────────┴──────────────────────────────┐
│                     Java API Gateway                          │
│      Reactive APIs • Rate Limiting • Backpressure             │
└──────────────▲───────────────▲───────────────▲───────────────┘
               │               │               │
        ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴────────┐
        │    Redis    │ │    Kafka    │ │ PostgreSQL    │
        │ Low latency │ │ Async queue │ │ Durable store │
        └─────────────┘ └─────────────┘ └───────────────┘
```

---

## 🔥 Failure Scenarios Tested
| Scenario | Observed Signal | Fix Applied |
| :--- | :--- | :--- |
| **DB slowdown** | P99 latency spike | Redis caching / Query optimization |
| **Kafka lag** | Queue depth growth | Consumer scaling / Partitioning |
| **Thread starvation** | RPS collapse | Reactive non-blocking stack |
| **GC pressure** | STW pauses | JVM Heap & GC tuning |

---

## 📂 Repo Structure
```text
.
├── benchmarks/              # Locust load testing scripts
├── frontend/                # Next.js Dashboard UI
├── infrastructure/          # Docker, SQL, Prometheus configs
│   ├── postgres/           # DB Init scripts
│   └── prometheus/         # Scrape configurations
├── services/
│   ├── api-gateway/         # Java Spring Boot Core API
│   ├── orchestrator/        # Node.js Test Controller
│   └── report-aggregator/   # Kafka Consumer (Node.js)
└── docker-compose.yml       # Entire stack orchestration
```

---

## � How to Run the Platform

1. **Infrastructure**: `docker-compose up -d`
2. **Java Core**: `cd services/api-gateway; mvn spring-boot:run`
3. **Node Services**: 
   - `cd services/orchestrator; npm start`
   - `cd services/report-aggregator; npm start`
4. **Frontend**: `cd frontend; npm run dev`
5. **Load Test**: `cd benchmarks; locust -f locustfile.py`

---

## � Resume-Ready Bullet Points
- Designed and implemented a production-grade distributed performance benchmarking platform using Next.js, Java, Redis, Kafka, PostgreSQL, Prometheus, and Grafana.
- Performed large-scale load, stress, and soak testing using Locust, identifying throughput ceilings and P99 latency bottlenecks.
- Built reactive, non-blocking APIs with backpressure handling (Resilience4j) and circuit breakers to sustain high-QPS workloads.
- Instrumented full-stack observability, tracking GC pauses, queue depth, CPU, memory, and database latency.
- Introduced intentional system failures (DB slowdown, queue saturation) and optimized architecture using metrics-driven insights.
