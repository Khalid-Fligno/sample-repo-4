import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuard } from './login.guard';

@NgModule({
  declarations: [],
  imports: 
  [
    CommonModule,
    HttpClientModule
  ],
  providers:
  [
    AuthGuard,
    AuthService,
    LoginGuard
  ]
})
export class AuthModule { }
