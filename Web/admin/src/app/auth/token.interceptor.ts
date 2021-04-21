import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  
  token:any;

  constructor(private afAuth:AngularFireAuth) 
  {
    this.token = localStorage.getItem('token')
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> 
  {
    request = request.clone({
      setHeaders: {
        // Authorization: `Bearer ${this.auth.getToken()}`
        authToken: this.token?this.token:''
      }
    });
    return next.handle(request);
  }
}
