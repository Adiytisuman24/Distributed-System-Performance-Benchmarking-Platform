from locust import HttpUser, task, between
import random

class BenchmarkUser(HttpUser):
    wait_time = between(0.1, 1.0) # Simulate high throughput

    @task(3)
    def test_fast_endpoint(self):
        self.client.get("/api/v1/benchmark/fast")

    @task(2)
    def test_compute(self):
        complexity = random.randint(10, 50)
        self.client.get(f"/api/v1/benchmark/compute?complexity={complexity}")

    @task(2)
    def test_db_query(self):
        self.client.get("/api/v1/benchmark/db-query?id=1")

    @task(1)
    def test_cache(self):
        key = f"test_key_{random.randint(1, 100)}"
        self.client.get(f"/api/v1/benchmark/cache?key={key}")
