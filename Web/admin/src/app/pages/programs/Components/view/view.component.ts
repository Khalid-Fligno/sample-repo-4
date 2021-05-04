import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent implements OnInit, OnDestroy {

  unsubRecipe:any;
  unsubWorkout:any;
  recipeList:any=[];
  workoutList:any=[];

  constructor
  (
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: AngularFirestore,
  ) 
  { 
    this.getRecipe();
    this.getWorkout();
  }

  ngOnInit(): void {}

  async getRecipe(){
    const recipeRef = this.db.firestore.collection('recipes');
    this.unsubRecipe = await recipeRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      var phaseMeals:any = [];
      this.data && this.data.phases.forEach((item:any) => {
        phaseMeals = [...phaseMeals,...item.meals]
      });
      // console.log(phaseMeals)
      querySnapshot.forEach(doc => {
        if(phaseMeals.includes(doc.data().id))
        data.push(doc.data());
        
      });
    if(data.length >0){
      this.recipeList = data;
      // console.log(this.recipeList)
    }
    }, (error) => {
      console.log("erroe",error)
    });
  }
  
  public _filter(id: string=""): any {
    let data =  this.recipeList.filter((option:any) => option.id === id)[0];
    return data && data.title?data.title:''
  }

  async getWorkout(){
    const recipeRef = this.db.firestore.collection('Workouts');
    this.unsubWorkout = await recipeRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[]
      querySnapshot.forEach(doc => {
        if(this.data.workouts.find((res:any)=>res.workoutId === doc.data().id))
          data.push(doc.data());
      });
    if(data.length >0){
      this.workoutList = data;
      // console.log(this.workoutList)
    }
    }, (error) => {
      console.log("erroe",error)
    });
  }
  
  public __filter(id: string=""): any {
  let data =  this.workoutList.filter((option:any) => option.id === id)[0];
  return data && data.displayName?data.displayName:''
  }
  //** */

  ngOnDestroy(){
    this.unsubRecipe();
    this.unsubWorkout();
  }
}
