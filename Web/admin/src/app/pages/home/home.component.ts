import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private http:HttpService) 
  { 
    this.http.currentPage="Dashboard";
  }

  ngAfterViewInit() {}
  
  ngOnInit(): void {}

}

