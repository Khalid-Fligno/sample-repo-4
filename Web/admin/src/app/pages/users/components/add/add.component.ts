import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { HttpService } from 'src/app/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent{

  Form: FormGroup;
  uploadProgress:any;
  Tags:any;

  bl:boolean = false;
  challengesList:any = [];
  selectedChallenge='';
  constructor
  (
    private fb:FormBuilder,
    private afStorage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private http:HttpService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddComponent>,
    private db: AngularFirestore,
  ) 
  {
    const d = this.data;
    if(d){
      this.Form = this.fb.group
      ({
        id:d?d.id:null,
        subscriptionInfo:this.fb.group({
          expiry:[d.subscriptionInfo?new Date(d.subscriptionInfo.expiry):'']
        }),
        selectedChallenge:['']
      });
      console.log(this.Form.value)
      this.getUserChallengesList();
    }else{
      this.Form = this.fb.group
      ({
        id:d?d.id:null,
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        country: ['unavailable'],
        email: ['',Validators.email],
        password: ['',Validators.pattern('(?=.*[0-9a-zA-Z]).{6,}')],
        signUpDate: [new Date()],
        fitnessLevel: [1],
        subscriptionInfo:this.fb.group({
          expiry:['']
        }),
        selectedChallenge:['']
      });
    }


    this.getChallengesList();
  }

  get f(){
    return this.Form.controls;
  }

  // saveData(){
  //   console.log(this.Form.value);
  //   this.http.addEditBlog(this.Form.value).subscribe((res)=>{
  //     if(res.success){
  //       this.dialog.open(SuccessComponent,{
  //         data:{
  //           title:"Updated!",
  //           subTitle:"Blog updated successfully."
  //         },
  //       });
  //       this.dialogRef.close();
  //     }
  //     this.spinner.hide();
  //   },
  //   err => {
  //     console.log('HTTP Error', err);
  //     this.spinner.hide();
  //     alert('Something went wrong,please try again');
  //   },
  //   )
  // }


  async getChallengesList(){
    const Programs = await (await this.db.firestore.collection('challenges').get()).docs;
    if(Programs && Programs.length > 0){
       Programs.map((res)=>{
          this.challengesList.push(res.data());
        })
    }
    console.log("data",this.challengesList);
  }

  async getUserChallengesList(){
    const Programs = await (await this.db.firestore.collection('users').doc(this.data.id).collection('challenges').get()).docs;
    if(Programs && Programs.length > 0){
       var challengeList:any= []
       Programs.map((res)=>{
         console.log(res.data());
          challengeList.push(res.data().id);
        });
        this.Form.patchValue({
          selectedChallenge:challengeList
        })
    }
    console.log("data",this.challengesList);
  }
  handleSave(){
    console.log(this.Form.value);
    if(this.data){
      this.updateUser();
    }
    else{
      this.addUser();
    }

  }

  addUser(){
    this.spinner.show();
    this.http.addEditUser(this.Form.value).subscribe(res=>{
      this.spinner.hide();
      console.log("Success",res);
        this.dialog.open(SuccessComponent,{
          data:{
            title:"Added!",
            subTitle:res.message
          },
        });
        this.dialogRef.close();
    },
    err=>{
      this.spinner.hide();
      console.log("Error",err);
      alert('Something went wrong,please try again');
    })
  }

  updateUser(){
    this.spinner.show();
    this.http.updateUser(this.Form.value).subscribe(res=>{
      this.spinner.hide();
      console.log("Success",res);
        this.dialog.open(SuccessComponent,{
          data:{
            title:"Added!",
            subTitle:res.message
          },
        });
        this.dialogRef.close();
    },
    err=>{
      this.spinner.hide();
      console.log("Error",err);
      alert('Something went wrong,please try again');
    })
  }
}
