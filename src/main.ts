import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

const Sentry = require('@sentry/node');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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

    await app.listen(3000);
}

bootstrap();
