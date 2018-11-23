import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

import * as session from 'express-session';
import * as passport from 'passport';

import { config } from '../config';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    cors: {
      origin: '*',
    },
  });

  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
