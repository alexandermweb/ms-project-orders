import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>,

    @Inject(PRODUCT_SERVICE) 
    private readonly productsClient:ClientProxy
  ){}


  async create(createOrderDto: CreateOrderDto) {

    try {

      const productIds = createOrderDto.items.map( item => item.productId);
      const products = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate-products' }, productIds)
      );
      
      //calcular los valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {

        const price = products.find(
          product => product.id === orderItem.productId
        ).price;

        return price * orderItem.quantity + acc;
      }, 0);


      const totalItems = createOrderDto.items.reduce( (acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // crear una transaccion de bd
      const order = this.orderRepository.create({
        totalAmount,
        totalItems,
        items: createOrderDto.items.map( orderItem => ({
          price: products.find(p => p.id === orderItem.productId).price,
          productId: orderItem.productId,
          quantity: orderItem.quantity
        }))
      });

      await this.orderRepository.save(order);
      return {
        ...order,
        items: order.items.map( orderItem => ({
          ...orderItem,
          name: products.find(p => p.id === orderItem.productId).name
        }))
      };
    } catch (error) {
      
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'check logs'
      })
    }
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


    const productIds = order.items.map( orderItem => orderItem.productId);

    const products = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate-products' }, productIds)
    );

    return {
      ...order,
      items: order.items.map( orderItem => ({
        ...orderItem,
        name: products.find(p => p.id === orderItem.productId).name
      }))
    };
  }


  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

}
