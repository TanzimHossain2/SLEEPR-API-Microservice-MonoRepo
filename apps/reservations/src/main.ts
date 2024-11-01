import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';

import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yaml';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino'; 


async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));

  const swaggerFilePath = path.resolve(__dirname, '../../../swagger.yaml');
  const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
  const swaggerDocument = yaml.parse(swaggerFile);

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
