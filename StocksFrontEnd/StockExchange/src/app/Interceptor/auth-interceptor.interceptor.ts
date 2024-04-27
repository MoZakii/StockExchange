import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, delay, filter, map, retry, retryWhen, switchMap, take, throwError } from 'rxjs';
import { AuthServiceService } from '../Auth/auth-service.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUserAutenticating: BehaviorSubject<any>;
  constructor( private router : Router ) {
    this.currentUserAutenticating = new BehaviorSubject<any>(null);
   }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request)
      .pipe(
      catchError((error): Observable<HttpEvent<any>> => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Redirect to login page
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
      retry({ count: 0 }));
  }

  public getToken(): string | null {
    return localStorage.getItem("token");
  }

  public saveToken(token : string) {
    return localStorage.setItem("token", token);
  }
}
