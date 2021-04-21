import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent implements OnInit {

  unsubExercise:any;
  fitnessLevels=["Beginner","Intermediate","Expert"];
  exerciseList:any = [];

  constructor
  ( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getExercises();
  }

  async getExercises()
  {
    const exerciseRef = this.db.firestore.collection('Exercises').where('workoutIds' ,'array-contains',this.data.id);
    this.unsubExercise = await exerciseRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      if(data.length >0){
        this.exerciseList = data;
        console.log(data)
      }
    }, 
    (error) => {
      console.log("erroe",error)
    });
  }
}
