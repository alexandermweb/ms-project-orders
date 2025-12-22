import { Order, OrderStatus } from "../entities/order.entity";


export interface OrderWithProducts {
  items: {
    name: any;
    id: string;
    productId: number;
    quantity: number;
    price: number;
    order: Order;
  }[];
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}