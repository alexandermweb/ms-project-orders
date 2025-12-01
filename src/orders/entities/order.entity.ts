import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

enum OrderStatus {
  PENDING = 'PENDING',
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

  //default false
  @Column({ type: 'boolean', default: false })
  paid:boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp'})
  updatedAt: Date;
}
