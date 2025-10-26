import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { getKafkaProducer } from '../../common/kafka/kafka.producer';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      clientName: dto.clientName,
      productName: dto.productName,
      value: dto.value,
      status: 'Pendente',
    });
    const saved = await this.ordersRepository.save(order);

    const producer = await getKafkaProducer();
    const topic = process.env.KAFKA_TOPIC || 'orders';

    const payload = {
      id: saved.id,
      clientName: saved.clientName,
      productName: saved.productName,
      value: Number(saved.value),
      status: saved.status,
      creationDate: saved.creationDate,
    };

    try {
      await producer.send({
        topic,
        messages: [
          {
            key: saved.id,
            value: JSON.stringify(payload),
            headers: {
              correlationId: saved.id,
              eventType: 'OrderCreated',
            },
          },
        ],
      });
      this.logger.log(`OrderCreated published. orderId=${saved.id}`);
    } catch (err) {
      this.logger.error('Erro ao publicar no Kafka', err);
    }

    return saved;
  }

  findAll() {
    return this.ordersRepository.find({ order: { creationDate: 'DESC' } });
  }

  findOne(id: string) {
    return this.ordersRepository.findOne({ where: { id } });
  }
}
