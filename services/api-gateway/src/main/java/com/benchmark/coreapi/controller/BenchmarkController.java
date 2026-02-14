package com.benchmark.coreapi.controller;

import com.benchmark.coreapi.service.WorkloadService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/benchmark")
@RequiredArgsConstructor
public class BenchmarkController {

    private final WorkloadService workloadService;

    @GetMapping("/fast")
    @RateLimiter(name = "fastApi")
    public Mono<Map<String, String>> fastEndpoint() {
        return Mono.just(Map.of("status", "ok", "latency", "minimal"));
    }

    @GetMapping("/compute")
    @CircuitBreaker(name = "heavyCompute", fallbackMethod = "computeFallback")
    public Mono<Map<String, Object>> heavyCompute(@RequestParam(defaultValue = "10") int complexity) {
        return workloadService.performCompute(complexity);
    }

    public Mono<Map<String, Object>> computeFallback(int complexity, Throwable t) {
        return Mono.just(Map.of(
                "status", "circuit_open",
                "message", "Heavy compute is temporarily unavailable due to load",
                "error", t.getMessage()));
    }

    @GetMapping("/db-query")
    public Mono<Map<String, Object>> dbQuery(@RequestParam(defaultValue = "1") int id) {
        return workloadService.queryDatabase(id);
    }

    @GetMapping("/cache")
    public Mono<Map<String, Object>> cacheAccess(@RequestParam String key) {
        return workloadService.accessCache(key);
    }

    @PostMapping("/chaos/latencies")
    public Mono<Void> injectLatency(@RequestBody Map<String, Integer> settings) {
        return workloadService.updateChaosSettings(settings);
    }
}
