import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderReceipt{

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @OneToOne(
    () => Order,
    order => order.receipt,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn()
  order: Order;

  @Column({type:'varchar'})
  receiptUrl:string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt: Date;
}