import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AlertsModule } from './alerts/alerts.module';
import { UserModule } from 'user/user.module';
import { AuthModule } from 'auth/auth.module';
import { config } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.dbUrl,
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      cache: false,
    }),
    AlertsModule,
    UserModule,
    AuthModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.schema.ts'),
        outputAs: 'class',
      },
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [AlertsModule, UserModule, AuthModule],
})
export class ApplicationModule {}
