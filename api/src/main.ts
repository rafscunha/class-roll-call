import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Roll Call API')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(
    {
      origin:"*",
      methods:["GET", "POST", "HEAD", "OPTION", "PATCH", "DELETE"],
      allowedHeaders:"*"

    })
  app.useWebSocketAdapter(new WsAdapter(app))
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
