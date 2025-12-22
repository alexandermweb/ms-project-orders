import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderReceipt } from "./order-receipt.entity";

export enum OrderStatus {
  PENDING   = 'PENDING',
  PAID      = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  // tiene que ser uuid
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({ type: 'int' })
  totalItems: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'boolean', default: false })
  paid:boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeChargeId?:string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt: Date;

  @OneToMany(() => OrderItems, item => item.order, { cascade: true, eager: true, })
  items: OrderItems[];


  @OneToOne(
    () => OrderReceipt,
    receipt => receipt.order,
    { cascade: true }
  )
  receipt?: OrderReceipt;
}


@Entity()
export class OrderItems{

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'int'})
  productId:number;

  @Column({type:'int'})
  quantity:number

  @Column({type:'float'})
  price:number

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

}



