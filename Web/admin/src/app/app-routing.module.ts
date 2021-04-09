import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './auth/login.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch: 'full'
  },
  {
    path:'login',
    loadChildren:()=>import('./login/login.module').then( m => m.LoginModule),
    // canActivate:[LoginGuard]
  },
  {
    path:'dashboard',
    loadChildren:()=> import('./pages/dashboard/dashboard.module').then( m => m.DashboardModule),
    // canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
