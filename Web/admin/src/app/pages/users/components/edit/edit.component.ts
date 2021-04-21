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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent{

  Form: FormGroup;
  uploadProgress:any;
  Tags:any;

  bl:boolean = false;

  constructor
  (
    private fb:FormBuilder,
    private afStorage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private http:HttpService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditComponent>,
    private db: AngularFirestore,
  ) 
  {
    const d = this.data;
    this.Form = this.fb.group
    ({
      id:d?d.id:null,
      firstName: [d && d.firstName?d.firstName:'',Validators.required],
      lastName: [d && d.lastName?d.lastName:'',Validators.required],
      country: [d && d.country?d.country:'',Validators.required],
      email: [d && d.email?d.email:'',Validators.required],
      signUpDate: [d && d.signUpDate?d.signUpDate:'',Validators.required],
      fitnessLevel: [d && d.fitnessLevel?d.fitnessLevel:'',Validators.required],
      
    });

    //this.getProgramTags();
  }

  get f(){
    return this.Form.controls;
  }

  // get tags() : FormArray {
  //   return this.Form.get("tags") as FormArray
  // }

  // addTag(){
  //   this.tags.push(this.fb.control(''))
  // }
  // removeTag(i:number) {
  //   this.tags.removeAt(i);
  // }

  // sanitizedImagePath(blob:any)
  // {
  //   if(typeof blob === 'object')  
  //   {
  //     let objectURL = URL.createObjectURL(blob);  
  //     return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  //   }
  //   else 
  //     return blob;
  // }

  // onSubmit() {
  //   if(this.Form.valid) {
  //     this.spinner.show();
  //     if(this.Form.value.urlLink.substring(0,4) != 'http'){
  //       let url = 'http://'+this.Form.value.urlLink;
  //       this.Form.value.urlLink = url;
  //     }
  //     this.upload();
  //   }
  //   else {
     
  //     if(this.f.coverImage.invalid){
  //       this.bl = true;
  //     }
      
  //     this.validateAllFields(this.Form);
  //   }
  // }

  // validateAllFields(formGroup: FormGroup) {         
  //   Object.keys(formGroup.controls).forEach(field => {  
  //     const control = formGroup.get(field);            
  //     if (control instanceof FormControl) {             
  //       control.markAsTouched({ onlySelf: true });
  //     } 
  //     else if (control instanceof FormGroup) {        
  //       this.validateAllFields(control);  
  //     }
  //   });
  // }

  // async upload() {
  //   let data = [{image:this.Form.value.coverImage}];
  //   // console.log(data)
  //   Promise.all(
  //     data.map(async (res,index)=>{
  //       return new Promise(async(resolve, reject) => {
  //         if(typeof res.image === 'object')  {
  //           // const randomId = Math.random().toString(36).substring(2);
  //           const ref = this.afStorage.ref(`Blogs/${this.Form.value.id}/coverImage`);
  //           const task = ref.put(res.image);
  //           this.uploadProgress = task.percentageChanges();
  //           (await task).ref.getDownloadURL()
  //           .then((res)=>{
  //                 this.Form.patchValue({
  //                   coverImage: res
  //                 });
  //               setTimeout(resolve, 0, 'success');
  //             }
  //           )
  //           .catch(err=>{
  //             console.log("Error in uploading",err);
  //             setTimeout(reject, 0, 'failed');
  //           })
  //         }else{
  //           setTimeout(resolve, 0, 'success');
  //         }
  //       })
  //     })
  //   ) 
  //   .then((res)=>{
  //     console.log(res,"then")
  //     this.saveData();
  //   })
  //   .catch(err=>console.log("Error!",err))
  // }


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


  // async getProgramTags(){
  //   const Programs = await (await this.db.firestore.collection('Programs').get()).docs;
  //   if(Programs && Programs.length > 0){
  //     this.Tags =  Programs.map((res)=>res.data().tag)
  //   }
  //   console.log("data",this.Tags);
  // }

  handleSave(){
    console.log(this.Form.value);
  }
}
