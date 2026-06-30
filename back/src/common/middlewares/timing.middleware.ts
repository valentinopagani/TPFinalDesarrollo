import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction): void {
		const startAt = Date.now();
		const originalSend = res.send.bind(res);

		res.send = (body: unknown) => {
			const ms = Date.now() - startAt;
			res.setHeader('X-Response-Time', `${ms} ms`);
      console.log(ms + 'ms')
			return originalSend(body);
		};

		next();

    // next() es una función que pasa el control al siguiente middleware en la cadena de ejecución.
    // Sin llamarla, la solicitud se queda colgada y nunca llega a otros middlewares, al controlador 
    // que maneja la ruta y la respuesta nunca se envía al cliente.

    // MIDDLEWARE:
    // se ejecuta antes de que Nest enrute la solicitud
    // tiene acceso solo request/response de Express
    // no transforma facilmente el response
    // controla el flujo con next() de manera lineal
    // se usa en logging, CORS, autenticaciones basicas...

    // INTERCEPTOR:
    // se ejecuta despues de que se resuelve la ruta envolviendo el handler
    // tiene acceso completo al ExecutionContext
    // puede transformar el body de la respuesta
    // controla el flujo con RxJS Observable de manera flexible
    // se usa en la tranformacion de datos, manejo de errores, timing...
	}
}
