import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import {
  getKafkaProducer,
  isKafkaConnected,
} from '../common/kafka/kafka.producer';

@Injectable()
export class KafkaHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (!isKafkaConnected()) {
        await getKafkaProducer();
      }

      if (!isKafkaConnected()) {
        throw new Error('Kafka producer is not connected');
      }

      const result = this.getStatus(key, true, {
        message: 'Kafka is healthy',
        connected: true,
      });

      return result;
    } catch (error) {
      const result = this.getStatus(key, false, {
        message: 'Kafka is unhealthy',
        error: error.message,
      });

      throw new HealthCheckError('Kafka health check failed', result);
    }
  }
}
