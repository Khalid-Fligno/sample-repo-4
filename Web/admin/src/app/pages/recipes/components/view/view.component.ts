import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  mealTypeList=[
    "breakfast",
    "lunch",
    "dinner",
    "snack"
  ];
  steps:any;
  types :any;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any ) { }
 
  ngOnInit(): void {
    console.log(this.data);
    this.steps = this.data && this.data.newRecipe?this.data.steps:this.data.steps.map((res:string,i:number)=>{return{image:this.data.stepsImages[i],description:res}} )
    this.types = this.data && this.data.newRecipe?this.data.types:this.mealTypeList.filter((res:string,i:number)=>this.data[res])
  }

}
