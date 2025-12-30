import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuditorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const audit = localStorage.getItem('x-auditor');
    const cloned = req.clone({
      setHeaders: {
        'X-Auditor': audit ? audit : 'system',
      },
    });
    return next.handle(cloned);
  }
}
