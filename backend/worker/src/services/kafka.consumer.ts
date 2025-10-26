import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { DataSource } from 'typeorm';
import { Order } from './../entities/order.entity';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    const kafka = new Kafka({ clientId: 'orders-worker', brokers });
    this.consumer = kafka.consumer({ groupId: 'orders-group' });
    await this.consumer.connect();
    const topic = process.env.KAFKA_TOPIC || 'orders';
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key?.toString();
        const value = message.value?.toString();
        const headers = message.headers || {};
        this.logger.log(
          `Mensagem recebida key=${key} headers=${JSON.stringify(headers)}`,
        );
        if (!value) return;
        const payload = JSON.parse(value);
        await this.processOrder(payload);
      },
    });
  }

  private async processOrder(payload: any) {
    const repo = this.dataSource.getRepository(Order);
    const order = await repo.findOne({ where: { id: payload.id } });
    if (!order) {
      this.logger.warn(`Order not found: ${payload.id}`);
      return;
    }
    if (order.status !== 'Pendente') {
      this.logger.log(`Skipping order ${order.id} with status ${order.status}`);
      return;
    }

    order.status = 'Processando';
    await repo.save(order);
    this.logger.log(`Order ${order.id} -> Processando`);
    await new Promise((r) => setTimeout(r, 5000)); // simula trabalho
    order.status = 'Finalizado';
    await repo.save(order);
    this.logger.log(`Order ${order.id} -> Finalizado`);
  }
}
