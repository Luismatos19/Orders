import { Kafka, Producer } from 'kafkajs';

let producer: Producer | null = null;
let isConnected = false;

export async function getKafkaProducer(): Promise<Producer> {
  if (producer && isConnected) return producer;

  const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
  const kafka = new Kafka({
    clientId: 'orders-api',
    brokers,
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  });

  producer = kafka.producer();

  try {
    await producer.connect();
    isConnected = true;
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Failed to connect Kafka producer:', error);
    isConnected = false;
    throw error;
  }

  return producer;
}

export function isKafkaConnected(): boolean {
  return isConnected && producer !== null;
}
