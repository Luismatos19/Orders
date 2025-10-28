import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../../src/orders/services/orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../../../src/orders/dto/create-order.dto';
import { Order } from '../../../src/entities/order.entity';

const mockProducer = {
  send: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('../../src/common/kafka/kafka.producer', () => ({
  getKafkaProducer: jest.fn().mockResolvedValue(mockProducer),
}));

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(getRepositoryToken(Order));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new order, then publish it to Kafka', async () => {
      const dto: CreateOrderDto = {
        clientName: 'Test Client',
        productName: 'Product X',
        value: 200,
      };

      const createdOrder: Partial<Order> = {
        ...dto,
        status: 'Pending',
      };

      const savedOrder: Order = {
        id: 'uuid-123',
        clientName: dto.clientName,
        productName: dto.productName,
        value: dto.value,
        status: 'Pending',
        creationDate: new Date(),
      } as Order;

      repository.create.mockReturnValue(createdOrder as Order);
      repository.save.mockResolvedValue(savedOrder);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        clientName: dto.clientName,
        productName: dto.productName,
        value: dto.value,
        status: 'Pending',
      });

      expect(repository.save).toHaveBeenCalledWith(createdOrder);

      expect(mockProducer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: expect.any(String),
          messages: expect.arrayContaining([
            expect.objectContaining({
              key: savedOrder.id,
              value: expect.stringContaining(savedOrder.clientName),
              headers: expect.objectContaining({
                correlationId: savedOrder.id,
                eventType: 'OrderCreated',
              }),
            }),
          ]),
        }),
      );

      expect(result).toEqual(savedOrder);
    });

    it('should log an error if Kafka publishing fails, but still return the saved order', async () => {
      const dto: CreateOrderDto = {
        clientName: 'Client Y',
        productName: 'Product Z',
        value: 150,
      };

      const savedOrder: Order = {
        id: 'uuid-456',
        clientName: dto.clientName,
        productName: dto.productName,
        value: dto.value,
        status: 'Pending',
        creationDate: new Date(),
      } as Order;

      repository.create.mockReturnValue(savedOrder);
      repository.save.mockResolvedValue(savedOrder);

      mockProducer.send.mockRejectedValueOnce(new Error('Kafka unavailable'));

      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      const result = await service.create(dto);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Erro ao publicar no Kafka',
        expect.any(Error),
      );

      expect(result).toEqual(savedOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders sorted by creationDate in descending order', async () => {
      const orders = [
        { id: '1', creationDate: new Date('2024-01-01') },
        { id: '2', creationDate: new Date('2024-02-01') },
      ] as Order[];

      repository.find.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { creationDate: 'DESC' },
      });

      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return a specific order by ID', async () => {
      const order = { id: 'uuid-789', clientName: 'John' } as Order;
      repository.findOne.mockResolvedValue(order);

      const result = await service.findOne('uuid-789');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-789' },
      });

      expect(result).toEqual(order);
    });
  });
});
