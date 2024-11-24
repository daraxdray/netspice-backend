import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const Sentry = require('@sentry/node');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();

    Sentry.init({
        dsn:
        process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        release:
            process.env.ENVIRONMENT != null && process.env.ENVIRONMENT == 'production'
                ? 'CI_JOB_ID'
                : 'local_testing',
        environment:
            process.env.ENVIRONMENT == null ? 'dev' : process.env.ENVIRONMENT,
        debug: !(
            process.env.ENVIRONMENT != null && process.env.ENVIRONMENT == 'production'
        ),
    });

    //Allows static assets accessible
    app.useStaticAssets(join(__dirname, '..','..', 'uploads'), {
        prefix: '/uploads/',
      });
  
    

    await app.listen(3000);
}

bootstrap();
