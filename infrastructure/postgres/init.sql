CREATE TABLE IF NOT EXISTS benchmark_results (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(50),
    latency INTEGER,
    throughput INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);