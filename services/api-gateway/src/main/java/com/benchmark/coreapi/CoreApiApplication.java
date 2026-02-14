package com.benchmark.coreapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@EnableR2dbcRepositories
public class CoreApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(CoreApiApplication.class, args);
	}
}
