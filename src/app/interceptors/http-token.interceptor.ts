import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private httpXsrfTokenExtractor: HttpXsrfTokenExtractor) {}
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const crsfTokenName = 'X-XSRF-TOKEN'
        const crsfToken = this.httpXsrfTokenExtractor.getToken() as string

        if(crsfToken != null && !req.headers.has(crsfTokenName)){
            req = req.clone({
                headers: req.headers.set(crsfTokenName, crsfToken)
            });
        }

        return next.handle(req);
    }
}
