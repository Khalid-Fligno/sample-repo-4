import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent implements OnInit ,OnDestroy {

  unsubExercise:any;
  unsubExerciseWC:any;
  unsubExerciseCD:any;
  fitnessLevels=["Beginner","Intermediate","Expert"];
  exerciseList:any = [];
  exerciseListWC:any = [];
  exerciseListCD:any = [];

  constructor
  ( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getExercises();
    this.getExercisesWC();
    this.getExercisesCD();
  }
  ngOnDestroy(){
    this.unsubExercise();
    this.unsubExerciseWC();
    this.unsubExerciseCD();
  }

  async getExercises()
  {
    const exerciseRef = this.db.firestore.collection('Exercises').where('id' ,'in',this.data.exercises);
    this.unsubExercise = await exerciseRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      if(data.length >0){
        this.exerciseList = this.data.exercises.map((id:any)=>{
          return data.find(res=>res.id === id);
        })
        console.log(data)
      }
    }, 
    (error) => {
      console.log("erroe",error)
    });
  }

  async getExercisesWC()
  {
    const exerciseRef = this.db.firestore.collection('WarmUpCoolDownExercises').where('id' ,'in',this.data.warmUpExercises);
    this.unsubExerciseWC = await exerciseRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      if(data.length >0){
        this.exerciseListWC = this.data.warmUpExercises.map((id:any)=>{
          return data.find(res=>res.id === id);
        });
        console.log(data)
      }
    }, 
    (error) => {
      console.log("erroe",error)
    });
  }

  async getExercisesCD()
  {
    const exerciseRef = this.db.firestore.collection('WarmUpCoolDownExercises').where('id' ,'in',this.data.coolDownExercises);
    this.unsubExerciseCD = await exerciseRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      if(data.length >0){
        this.exerciseListCD = this.data.coolDownExercises.map((id:any)=>{
          return data.find(res=>res.id === id);
        });
        console.log(data)
      }
    }, 
    (error) => {
      console.log("erroe",error)
    });
  }

  
}
