import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../../src/orders/controllers/orders.controller';
import { OrdersService } from '../../../src/orders/services/orders.service';
import { CreateOrderDto } from '../../../src/orders/dto/create-order.dto';
import { Order } from '../../../src/entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const mockOrdersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call OrdersService.create with the provided DTO and return the result', async () => {
      const dto: CreateOrderDto = {
        clientName: 'Alice',
        productName: 'Product A',
        value: 100,
      };

      const createdOrder: Order = {
        id: 'uuid-1',
        clientName: 'Alice',
        productName: 'Product A',
        value: 100,
        status: 'Pending',
        creationDate: new Date(),
      } as Order;

      jest.spyOn(service, 'create').mockResolvedValue(createdOrder);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('findAll', () => {
    it('should call OrdersService.findAll and return the list of orders', async () => {
      const orders: Order[] = [
        {
          id: '1',
          clientName: 'Alice',
          productName: 'Product A',
          value: 100,
          status: 'Pending',
          creationDate: new Date(),
        },
        {
          id: '2',
          clientName: 'Bob',
          productName: 'Product B',
          value: 200,
          status: 'Completed',
          creationDate: new Date(),
        },
      ] as Order[];

      jest.spyOn(service, 'findAll').mockResolvedValue(orders);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should call OrdersService.findOne with the given id and return the order', async () => {
      const id = 'uuid-2';
      const order: Order = {
        id,
        clientName: 'Charlie',
        productName: 'Product C',
        value: 300,
        status: 'Pending',
        creationDate: new Date(),
      } as Order;

      jest.spyOn(service, 'findOne').mockResolvedValue(order);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(order);
    });
  });
});
