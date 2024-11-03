import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { Logger } from 'nestjs-pino';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const swaggerFilePath = path.resolve(__dirname, '../../../swagger.yaml');
  const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
  const swaggerDocument = yaml.parse(swaggerFile);

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const configService = app.get(ConfigService);

 
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
