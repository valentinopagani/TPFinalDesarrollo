import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // elimina campos no declarados en el DTO
			forbidNonWhitelisted: true, // lanza error si llegan campos extra
			transform: true, // convierte tipos automáticamente (string → number, etc.)
		}),
	);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
