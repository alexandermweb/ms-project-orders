import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItems } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NatsModule } from 'src/transports/nats.module';
import { OrderReceipt } from './entities/order-receipt.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Order, OrderItems, OrderReceipt]),

    NatsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
