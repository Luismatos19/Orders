import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import {
  isKafkaConnected,
  getKafkaProducer,
} from '../common/kafka/kafka.producer';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkKafka(),
    ]);
  }

  private async checkKafka(): Promise<HealthIndicatorResult> {
    try {
      if (isKafkaConnected()) {
        return {
          kafka: {
            status: 'up',
            message: 'Kafka is healthy',
            connected: true,
          },
        };
      }

      try {
        await getKafkaProducer();
        return {
          kafka: {
            status: 'up',
            message: 'Kafka is healthy',
            connected: true,
          },
        };
      } catch (connectionError) {
        return {
          kafka: {
            status: 'down',
            message: 'Kafka is unhealthy',
            error: `Failed to connect: ${connectionError.message}`,
          },
        };
      }
    } catch (error) {
      return {
        kafka: {
          status: 'down',
          message: 'Kafka is unhealthy',
          error: error.message,
        },
      };
    }
  }
}
