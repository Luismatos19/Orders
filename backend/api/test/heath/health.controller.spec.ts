import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../src/health/health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus';
import {
  isKafkaConnected,
  getKafkaProducer,
} from '../../src/common/kafka/kafka.producer';

jest.mock('../../src/common/kafka/kafka.producer', () => ({
  isKafkaConnected: jest.fn(),
  getKafkaProducer: jest.fn(),
}));

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let dbIndicator: jest.Mocked<TypeOrmHealthIndicator>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const mockTypeOrmHealthIndicator = {
      pingCheck: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockTypeOrmHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(
      HealthCheckService,
    ) as jest.Mocked<HealthCheckService>;
    dbIndicator = module.get(
      TypeOrmHealthIndicator,
    ) as jest.Mocked<TypeOrmHealthIndicator>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('check', () => {
    it('should run health checks for database and Kafka', async () => {
      const mockResult: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' }, kafka: { status: 'up' } },
        error: {},
        details: {},
      };

      healthCheckService.check.mockResolvedValue(mockResult);

      const result = await controller.check();

      expect(healthCheckService.check).toHaveBeenCalled();
      const [dbCheckFn, kafkaCheckFn] =
        healthCheckService.check.mock.calls[0][0];
      expect(typeof dbCheckFn).toBe('function');
      expect(typeof kafkaCheckFn).toBe('function');

      expect(result).toEqual(mockResult);
    });
  });

  describe('checkKafka', () => {
    it('should return healthy if Kafka is already connected', async () => {
      (isKafkaConnected as jest.Mock).mockReturnValue(true);

      const result = await (controller as any).checkKafka();

      expect(result).toEqual({
        kafka: {
          status: 'up',
          message: 'Kafka is healthy',
          connected: true,
        },
      });
    });

    it('should return healthy if Kafka connects successfully', async () => {
      (isKafkaConnected as jest.Mock).mockReturnValue(false);
      (getKafkaProducer as jest.Mock).mockResolvedValue({});

      const result = await (controller as any).checkKafka();

      expect(getKafkaProducer).toHaveBeenCalled();
      expect(result).toEqual({
        kafka: {
          status: 'up',
          message: 'Kafka is healthy',
          connected: true,
        },
      });
    });

    it('should return unhealthy if Kafka connection fails', async () => {
      (isKafkaConnected as jest.Mock).mockReturnValue(false);
      (getKafkaProducer as jest.Mock).mockRejectedValue(
        new Error('Connection failed'),
      );

      const result = await (controller as any).checkKafka();

      expect(result).toEqual({
        kafka: {
          status: 'down',
          message: 'Kafka is unhealthy',
          error: 'Failed to connect: Connection failed',
        },
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      (isKafkaConnected as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await (controller as any).checkKafka();

      expect(result).toEqual({
        kafka: {
          status: 'down',
          message: 'Kafka is unhealthy',
          error: 'Unexpected error',
        },
      });
    });
  });
});
