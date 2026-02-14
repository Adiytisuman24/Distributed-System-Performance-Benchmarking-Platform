const { Kafka } = require('kafkajs');
const { Client } = require('pg');

const kafka = new Kafka({
    clientId: 'report-aggregator',
    brokers: ['localhost:9092']
});

const pgClient = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'benchmark_db',
    password: 'password',
    port: 5432,
});

const consumer = kafka.consumer({ groupId: 'aggregator-group' });

const run = async () => {
    await pgClient.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-results', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());
            console.log('Received result:', data);
            
            // Persist to DB
            await pgClient.query(
                'INSERT INTO benchmark_results(test_id, latency, throughput, status) VALUES($1, $2, $3, $4)',
                [data.testId, data.latency, data.throughput, data.status]
            );
        },
    });
};

run().catch(console.error);
