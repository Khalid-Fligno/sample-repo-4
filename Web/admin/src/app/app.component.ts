import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'admin';
  constructor(
    private authService:AuthService,
    private router:Router
    ){
  }
  
  ngOnInit(){
    this.authService.authSubject.subscribe(state=>{
      this.router.navigate(['/dashboard'], {replaceUrl:true})
      // if(state) {
      //   this.router.navigate(['/dashboard'], {replaceUrl:true})
      // } 
      // else {
      //   this.router.navigate(['login'])
      // }
    })
  }

  ngOnDestroy(){
    console.log("Destroeydddd")
  }
}
