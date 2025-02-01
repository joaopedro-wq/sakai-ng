import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpPersonService {
    constructor(private http: HttpClient) {}

    private urlBase = environment.urlBase;

    private httpOptions = {
        withCredentials: true,
    };

    get<T = any>(url: string = '', options: any = {}): Observable<Object> {
        let formatURL = url.startsWith('/') ? url.substring(1) : url;
        // Mescla httpOptions padrão com as opções fornecidas, garantindo que observe: 'body' seja usado
        const mergedOptions = {
            ...this.httpOptions,
            ...options,
            observe: 'body' as const,
        };
        return this.http.get<T>(`${this.urlBase}/${formatURL}`, mergedOptions);
    }

    post<T = any>(
        url: string = '',
        parameter: any,
        options: any = {}
    ): Observable<any> {
        let formatURL = url.startsWith('/') ? url.substring(1) : url;
        const mergedOptions = {
            ...this.httpOptions,
            ...options,
            observe: options.observe ?? 'body', // preserva o observe passado em options
        };

        return this.http.post<T>(
            `${this.urlBase}/${formatURL}`,
            parameter,
            mergedOptions
        );
    }

    put<T = any>(
        url: string = '',
        parameter: any,
        options: any = {}
    ): Observable<any> {
        let formatURL = url.startsWith('/') ? url.substring(1) : url;
        const mergedOptions = {
            ...this.httpOptions,
            ...options,
            observe: 'body' as const,
        };
        return this.http.put<T>(
            `${this.urlBase}/${formatURL}`,
            parameter,
            mergedOptions
        );
    }

    delete<T = any>(url: string = '', options: any = {}): Observable<any> {
        let formatURL = url.startsWith('/') ? url.substring(1) : url;
        const mergedOptions = {
            ...this.httpOptions,
            ...options,
            observe: 'body' as const,
        };
        return this.http.delete<T>(
            `${this.urlBase}/${formatURL}`,
            mergedOptions
        );
    }

    getURL(relativeURL: string) {
        let formatURL = relativeURL.startsWith('/')
            ? relativeURL.substring(1)
            : relativeURL;
        return `${this.urlBase}/${formatURL}`;
    }
}
