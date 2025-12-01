import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,

      autoLoadEntities: true,
      synchronize: true,
    }),
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
