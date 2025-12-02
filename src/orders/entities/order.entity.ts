import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum OrderStatus {
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

  @Column({ type: 'boolean', default: false })
  paid:boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt: Date;
}
