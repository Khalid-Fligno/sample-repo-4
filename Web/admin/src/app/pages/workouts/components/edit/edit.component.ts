import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class EditComponent implements OnInit {

  Form: FormGroup;
  uploadProgress:any;
  fitnessLevels=["Beginner","Intermediate","Expert"];
  workoutFilterList: any[] = [
    {label:"Upper Body",value:'upperBody'},
    {label:"Lower Body",value:'lowerBody'},
    {label:"Core",value:'core'} 
  ];

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
  ) 
  {
    console.log(this.data)
    const d = this.data
    this.Form = this.fb.group({
      id:d && d.id?d.id:uuidv4(),
      coverImage: [d && d.coverImage?d.coverImage:'',Validators.required],
      reps:d && d.reps?this.fb.array(d.reps.map((res:any)=>res)):this.fb.array(['','','']), //array
      displayName: [d && d.displayName?d.displayName:'',Validators.required],
      description: [d && d.description?d.description:'',Validators.required],
      filters: [d && d.filters?d.filters:'',Validators.required], //array
      name: [d && d.name?d.name:'',Validators.required],
      restIntervalMap: d && d.restIntervalMap?this.fb.array(d.restIntervalMap.map((res:any)=>res)):this.fb.array(['','','']), //array
      // tags : d &&?this.fb.array(d.tags.map((res:any)=>res)):this.fb.array([]), //array
      workIntervalMap: d && d.workIntervalMap?this.fb.array(d.workIntervalMap.map((res:any)=>res)):this.fb.array(['','','']), //array
      sets: [d && d.sets?d.sets:'',Validators.required],
      workoutTime: [d && d.workoutTime?d.workoutTime:'',Validators.required],
    });
   }

  ngOnInit(): void { }

  get f(){
    return this.Form.controls;
  }

  get reps() : FormArray {
    return this.Form.get("reps") as FormArray
  }

  // get filters() : FormArray {
  //   return this.Form.get("filters") as FormArray
  // }

  get restIntervalMap() : FormArray{
    return this.Form.get("restIntervalMap") as FormArray
  }

  get tags() : FormArray{
    return this.Form.get("tags") as FormArray
  }

  addTags(){
    this.tags.push(this.fb.control(''))
  }

  removeTags(i:number) {
    this.tags.removeAt(i);
  }

  get workIntervalMap() : FormArray{
    return this.Form.get("workIntervalMap") as FormArray
  }

  // addDifficultyLevel(){
  //   this.reps.push(this.fb.control(''))
  // }
  // removeDifficultyLevel(i:number) {
  //   this.reps.removeAt(i);
  // }

  // addFilters(){
  //   this.filters.push(this.fb.control(''))
  // }
    // removeFilters(i:number) {
  //   this.filters.removeAt(i);
  // }


  // addRestIntervalMap(){
  //   this.restIntervalMap.push(this.fb.control(''))
  // }
  // removeRestIntervalMap(i:number) {
  //   this.restIntervalMap.removeAt(i);
  // }
  // addWorkIntervalMap(){
  //   this.workIntervalMap.push(this.fb.control(''))
  // }

  // removeWorkIntervalMap(i:number) {
  //   this.workIntervalMap.removeAt(i);
  // }
  

  sanitizedImagePath(blob:any)
  {
    if(typeof blob === 'object')  {
      let objectURL = URL.createObjectURL(blob);  
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    else 
      return blob
  }

  async onFileChange(event:any) 
  {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
   
      reader.readAsDataURL(file);
    
      reader.onload = async() => {
        const base64Response = await fetch(reader.result as string);
        await base64Response.blob().then((res)=>{
          this.Form.patchValue({
            coverImage: res
          });
        })
      };
    }
  }
 
  onSubmit() {
    console.log(this.Form.value)
    this.spinner.show();
    this.upload();
  }

  async upload() {
    let data = [{image:this.Form.value.coverImage}];
    // console.log(data)
    Promise.all(
      data.map(async (res,index)=>{
        return new Promise(async(resolve, reject) => {
          if(typeof res.image === 'object')  {
            // const randomId = Math.random().toString(36).substring(2);
            const ref = this.afStorage.ref(`Workouts/${this.Form.value.id}/coverImage`);
            const task = ref.put(res.image);
            this.uploadProgress = task.percentageChanges();
            (await task).ref.getDownloadURL()
            .then((res)=>{
                  this.Form.patchValue({
                    coverImage: res
                  });
                setTimeout(resolve, 0, 'success');
              }
            )
            .catch(err=>{
              console.log("Error in uploading",err);
              setTimeout(reject, 0, 'failed');
            })
          }
          else
          {
            setTimeout(resolve, 0, 'success');
          }
        })
      })
    ) 
    .then((res)=>{
      console.log(res,"then")
      this.saveData();
    })
    .catch(err=>console.log("Error!",err))
  }
 

  saveData(){
      console.log(this.Form.value);
      this.http.addEditWorkout(this.Form.value).subscribe((res)=>{
        if(res.success){
          this.dialog.open(SuccessComponent,{
            data:{
              title:"Updated!",
              subTitle:"Workout updated successfully."
            },
          });
        }
        this.dialogRef.close();
        this.spinner.hide();
      },
      err => {
        console.log('HTTP Error', err);
        this.spinner.hide();
        alert('Something went wrong,please try again');
      },
      )
  }
}
