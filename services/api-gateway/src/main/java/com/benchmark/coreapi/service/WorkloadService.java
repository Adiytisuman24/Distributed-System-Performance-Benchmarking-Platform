package com.benchmark.coreapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class WorkloadService {

    private final DatabaseClient databaseClient;
    private final ReactiveRedisTemplate<String, String> redisTemplate;
    private final org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;
    private final Random random = new Random();

    // Chaos settings
    private final AtomicInteger artificialDbDelay = new AtomicInteger(0);
    private final AtomicInteger artificialComputeDelay = new AtomicInteger(0);

    public Mono<Map<String, Object>> performCompute(int complexity) {
        return Mono.fromCallable(() -> {
            long start = System.currentTimeMillis();
            double result = 0;
            for (int i = 0; i < complexity * 100000; i++) {
                result += Math.sqrt(i) * Math.sin(i);
            }
            long end = System.currentTimeMillis();
            long latency = end - start;

            // Async Kafka logging
            kafkaTemplate.send("test-results", "COMPUTE",
                    String.format("{\"type\":\"compute\",\"latency\":%d}", latency));

            Map<String, Object> response = new HashMap<>();
            response.put("compute_time_ms", latency);
            response.put("result_hash", Double.toHexString(result));
            return response;
        }).delayElement(Duration.ofMillis(artificialComputeDelay.get()));
    }

    public Mono<Map<String, Object>> queryDatabase(int id) {
        long start = System.currentTimeMillis();
        return databaseClient.sql("SELECT pg_sleep($1/1000.0), 'OK' as status")
                .bind(0, artificialDbDelay.get())
                .fetch()
                .first()
                .map(row -> {
                    long latency = System.currentTimeMillis() - start;
                    kafkaTemplate.send("test-results", "DB",
                            String.format("{\"type\":\"db\",\"latency\":%d}", latency));
                    return Map.of("db_status", "connected", "artificial_delay", artificialDbDelay.get(), "real_latency",
                            latency);
                })
                .defaultIfEmpty(Map.of("error", "no_data"));
    }

    public Mono<Map<String, Object>> accessCache(String key) {
        return redisTemplate.opsForValue().get(key)
                .map(val -> Map.of("cache_hit", true, "value", val))
                .switchIfEmpty(redisTemplate.opsForValue().set(key, "cached_at_" + System.currentTimeMillis())
                        .thenReturn(Map.of("cache_hit", false, "status", "populated")));
    }

    public Mono<Void> updateChaosSettings(Map<String, Integer> settings) {
        if (settings.containsKey("db_delay"))
            artificialDbDelay.set(settings.get("db_delay"));
        if (settings.containsKey("compute_delay"))
            artificialComputeDelay.set(settings.get("compute_delay"));
        log.info("Chaos settings updated: DB Delay={}ms, Compute Delay={}ms",
                artificialDbDelay.get(), artificialComputeDelay.get());
        return Mono.empty();
    }
}
