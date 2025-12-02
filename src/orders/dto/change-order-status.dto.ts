import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "../entities/order.entity";
import { OrderStatusList } from "../enum/order.enum";



export class ChangeOrderStatusDto{

  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Status must be one of ${OrderStatusList}`,
  })
  status: OrderStatus
}