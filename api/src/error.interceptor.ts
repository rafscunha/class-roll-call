import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException, BadRequestException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        return throwError(() => {
            new BadRequestException({reason:err.message})
        });
      }),
    );
  };
};


