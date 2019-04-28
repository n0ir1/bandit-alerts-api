import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsModule } from './alerts/alerts.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { config } from '../config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.dbUrl,
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      cache: false,
    }),
    UserModule,
    AuthModule,
    AlertsModule,
    SharedModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
    }),
  ],
})
export class ApplicationModule {}
