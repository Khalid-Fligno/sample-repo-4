import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { HttpService } from 'src/app/http.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrls: ['./edit-exercise.component.scss']
})

export class EditExerciseComponent implements OnInit, OnDestroy {
  
  workoutList: any[] = [];
  Form: FormGroup;
  uploadProgress:any;
  unsubWorkouts:any;

  //search
  searchOptions:any[]=[];
  selectedItem = new FormControl();
  filteredOptions!: Observable<any>;
  //* */

  typeList = [
    {label:"Warm Up" , value:"WarmUp"},
    {label:"Cool Down" , value:"coolDown"}
  ]
  modelNamesList:any = [];
  constructor
  (
    private fb:FormBuilder,
    private afStorage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private http:HttpService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditExerciseComponent>,
  ) 
  {
    const d = this.data
    this.Form = this.fb.group
    ({
      id:d && d.id?d.id:uuidv4(),
      name: [d && d.name?d.name:'',Validators.required],
      displayName: [d && d.displayName ?d.displayName:'',Validators.required],
      type: [d && d.type ?d.type:'',Validators.required],
      recommendedResistance: d && d.recommendedResistance?d.recommendedResistance:'',
      coachingTip:d && d.coachingTip?this.fb.array(d.coachingTip.map((res:any)=>res)):this.fb.array([]),
      videoUrls: d && d.videoUrls?this.fb.array(d.videoUrls.map((res:any)=>this.newVideo(res))): this.fb.array([this.newVideo()]),
      // workoutIds:[d && d.workoutIds?d.workoutIds:'',Validators.required],
    });
  }

  ngOnInit(){
    // this.getWorkouts();
    this.applySearch();
    this.getModels();
  }

  getModels(){
    this.http.getModels()
    .subscribe(res=>this.modelNamesList = res.models);
  }

  ngOnDestroy(){
    // this.unsubWorkouts();
  }


  //form
  get f(){
    return this.Form.controls;
  }


  //workouts
  // async getWorkouts(){
  //   const workoutRef = this.db.firestore.collection('Workouts');
  //   this.unsubWorkouts = await workoutRef
  //   .onSnapshot((querySnapshot) => {
  //     var data:any =[]
  //     querySnapshot.forEach(doc => {
  //       data.push(doc.data());
  //     });
  //     this.workoutList = this.searchOptions = data;
  //   }, (error) => {
  //     console.log("erroe",error)
  //   });
  // }

  addWorkout(){
    this.coachingTip.push(this.fb.control(''))
  }
  removeWorkout(i:number) {
    this.coachingTip.removeAt(i);
  }


  //coaching tip
  get coachingTip() : FormArray {
    return this.Form.get("coachingTip") as FormArray
  }

  addCoachingTip(){
    this.coachingTip.push(this.fb.control(''))
  }
  removeCoacingTip(i:number) {
    this.coachingTip.removeAt(i);
  }


  //video
  get videoUrls() : FormArray {
    return this.Form.get("videoUrls") as FormArray
  }

  newVideo(data:any=null): FormGroup {
    return this.fb.group
    ({
      url: data?data.url:null,
      model: data?data.model:null,
    })
  }
 
  addVideo() {
    this.videoUrls.push(this.newVideo());
  }

  removeVideo(i:number){
    this.videoUrls.removeAt(i);
  }


  sanitizedImagePath(blob:any)
  {
    if(typeof blob === 'object')  
    {
      let objectURL = URL.createObjectURL(blob);  
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    else 
      return blob;
  }

  async onFileChange2(event:any,index:any) 
  {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) 
    {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = async() => {
        const base64Response = await fetch(reader.result as string);
        // var blob = base64Response.blob()._W;
        // console.log(reader.result as string);
        await base64Response.blob().then((res)=>{
          this.videoUrls.at(index)
          .patchValue({
            url: res
          });
        })
      };
    }
  }
 
 
  onSubmit() {
    this.spinner.show();
    this.upload();
  }


  async upload() {
    let data = this.videoUrls.value.length > 0 ?[...this.videoUrls.value]:[];
    console.log(data)
    Promise.all(
      data.map(async (res,index)=>{
        return new Promise(async(resolve, reject) => {
          if(typeof res.url === 'object')  {
            // const randomId = Math.random().toString(36).substring(2);
            const ref = this.afStorage.ref(`WarmUpCoolDownExercises/${this.Form.value.id}/Video${index+1}`);
            const task = ref.put(res.url);
            this.uploadProgress = task.percentageChanges();
            (await task).ref.getDownloadURL()
            .then((res)=>{
              this.videoUrls.at(index).patchValue({
                url:res
              })
              setTimeout(resolve, 0, 'success');
            })
            .catch(err=>{
              console.log("Error in uploading",err);
              setTimeout(reject, 0, 'failed');
            })
          }
          else{
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
    this.http.addEditWCExercises(this.Form.value).subscribe((res)=>{
      if(res.success){
        this.dialog.open(SuccessComponent,{
          data:{
            title:"Updated!",
            subTitle:"Exercise updated successfully."
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


  //search
  applySearch(){
    this.filteredOptions = this.selectedItem.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.searchOptions.slice())
    );
    this.filteredOptions.subscribe(res=>{
      console.log(res)
      if(res.length > 0) {
        this.workoutList = res;
        console.log(this.workoutList)
      }
    })
  }
    

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.searchOptions.filter((option:any) => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  //* *//


}
