import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { HttpService } from 'src/app/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
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
    this.Form = this.fb.group
    ({
      id:d?d.id:null,
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      country: ['unavailable'],
      email: ['',Validators.required],
      signUpDate: [new Date()],
      fitnessLevel: [1],
      subscriptionInfo:this.fb.group({
        expiry:['']
      })
    });

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
    const Programs = await (await this.db.firestore.collection('Challenges').get()).docs;
    if(Programs && Programs.length > 0){
       Programs.map((res)=>{
          this.challengesList.push(res.data());
        })
    }
    console.log("data",this.challengesList);
  }

  handleSave(){
    console.log(this.Form.value);
  }
}
