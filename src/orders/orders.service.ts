import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>
  ){}

  create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.save(createOrderDto);
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const { page, size, status } = orderPaginationDto;

    const totalPages = await this.orderRepository.count({
      where: { status}
    });

    const data = await this.orderRepository.find({
      where: {status},
      take: size,
      skip: (page! - 1) * size!
    });

    return {
      page,
      totalPages,
      data
    }
  }

  async findOne(id: string) {

    const order = await this.orderRepository.findOneBy({id});

    if(!order) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `Order with id: ${id} not found`
    });

    return order;
  }


  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

}
