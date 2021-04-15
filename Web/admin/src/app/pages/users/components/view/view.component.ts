import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent {
  challengeList:any = [];
  constructor( @Inject(MAT_DIALOG_DATA) public data: any ,
  private db: AngularFirestore,) { 

    this.getChallengeList();
  }

  async getChallengeList(){
    const challengeData  = await this.db.firestore.collection('users').doc(this.data.id).collection('challenges').get();
    challengeData.forEach((res)=>{
      this.challengeList.push(res.data());
    })
  }

  checkDateType(date:any){
    if(typeof date === "object")
      return true
    
    return false  
  }
}
