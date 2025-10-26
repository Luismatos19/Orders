import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaConsumerService } from './services/kafka.consumer';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: +process.env.DATABASE_PORT! || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASS || 'postgres',
      database: process.env.DATABASE_NAME || 'orders',
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConsumerService],
})
export class AppModule {}
