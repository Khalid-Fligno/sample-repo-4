import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor
  (
    private authService:AuthService,
    public http:HttpService
  ) {}

  ngOnInit(): void {}

  handleLogOut()
  {
    this.authService.logout();
  }
}
