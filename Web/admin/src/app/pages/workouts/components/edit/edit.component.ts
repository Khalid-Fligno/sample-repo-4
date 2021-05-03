import { D, T } from '@angular/cdk/keycodes';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit ,OnDestroy {
  Form: FormGroup;
  
  exerciseList: any[] = [];
  exerciseListWC: any[] = [];
  exerciseListCD: any[] = [];
  unsubExercise:any;
  unsubExerciseWC:any;

  uploadProgress:any;
  fitnessLevels=["Beginner","Intermediate","Expert"];
  workoutFilterList: any[] = [
    {label:"Strength",value:'strength'},
    {label:"Circuit",value:'circuit'},
    {label:"Interval",value:'interval'},
    {label:"Full Body",value:'fullBody'},
    {label:"Upper Body",value:'upperBody'},
    {label:"Lower Body",value:'lowerBody'},
    {label:"Core",value:'core'} ,
    {label:"Full Equipment",value:'fullEquipment'} ,
    {label:"FitazFk Equipment",value:'fitazFKEquipment'} ,
    {label:"Minimal Equipment",value:'minimalEquipment'}, 
    {label:"No Equipment",value:'noEquipment'} 
  ];

  Tags: any[] = [
    {label:"Subscription",value:'Subscription'},
    {label:"8 Week Challenge",value:'8WC'},
    {label:"New Year Better You",value:'NYBY'},
  ];
  modelNamesList:any =[];
  
  //search
  searchOptions:any[]=[];
  selectedItem = new FormControl();
  filteredOptions!: Observable<any>;
  //* */

  //search WC
    searchOptionsWC:any[]=[];
    selectedItemWC = new FormControl();
    filteredOptionsWC!: Observable<any>;
  //* */
  //search WC
    searchOptionsCD:any[]=[];
    selectedItemCD= new FormControl();
    filteredOptionsCD!: Observable<any>;
  //* */
  selectedModel:string='';
  selectedModelWC:string='';
  selectedModelCD:string='';
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
    console.log(this.data)
    const d = this.data;
    this.selectedModel = d && d.exerciseModel?d.exerciseModel:'';
    this.selectedModelWC = d && d.warmUpExerciseModel?d.warmUpExerciseModel:'';
    this.selectedModelCD = d && d.exerciseModel?d.exerciseModel:'';
    this.Form = this.fb.group({
      id:d && d.id?d.id:uuidv4(),
      thumbnail: [d && d.thumbnail?d.thumbnail:'',Validators.required],
      //difficultyLevel means difficultyLevel
      difficultyLevel:d && d.difficultyLevel?this.fb.array(d.difficultyLevel.map((res:any)=>res)):this.fb.array(['','','']), //array
      displayName: [d && d.displayName?d.displayName:'',Validators.required],
      description: [d && d.description?d.description:'',Validators.required],
      filters: [d && d.filters?d.filters:'',Validators.required], //array
      name: [d && d.name?d.name:'',Validators.required],
      restIntervalMap: d && d.restIntervalMap?this.fb.array(d.restIntervalMap.map((res:any)=>res)):this.fb.array(['','','']), //array
      tags : [d &&d.tags?d.tags:'',Validators.required], //array
      exerciseModel : [d &&d.exerciseModel?d.exerciseModel:'',Validators.required], //array
      exercises : [d &&d.exercises?d.exercises:'',Validators.required], //array
      warmUpExerciseModel : [d &&d.warmUpExerciseModel?d.warmUpExerciseModel:'',Validators.required], //array
      warmUpExercises : [d &&d.warmUpExercises?d.warmUpExercises:'',Validators.required], //array
      coolDownExerciseModel : [d &&d.coolDownExerciseModel?d.coolDownExerciseModel:'',Validators.required], //array
      coolDownExercises : [d &&d.coolDownExercises?d.coolDownExercises:'',Validators.required], //array
      workIntervalMap: d && d.workIntervalMap?this.fb.array(d.workIntervalMap.map((res:any)=>res)):this.fb.array(['','','']), //array
      WorkoutReps: [d && d.WorkoutReps?d.WorkoutReps:'',Validators.required], //WorkoutReps means Sets
      workoutTime: [d && d.workoutTime?d.workoutTime:'',Validators.required],
      count:[d && d.count?d.count:false],
      newWorkout:true
    });
   }

  ngOnInit(): void {

    this.getExercises();
    this.applySearch();
    this.getModels();
    this.getExercisesWC();
    this.applyWarmUpSearch();
    this.applyCoolDownSearch();
   }

   ngOnDestroy(){
     this.unsubExercise();
     this.unsubExerciseWC();
   }

   getModels(){
    this.http.getModels()
    .subscribe(res=>this.modelNamesList = res.models);
  }


  get f(){
    return this.Form.controls;
  }

  get difficultyLevel() : FormArray {
    return this.Form.get("difficultyLevel") as FormArray
  }

  // get filters() : FormArray {
  //   return this.Form.get("filters") as FormArray
  // }

  get restIntervalMap() : FormArray{
    return this.Form.get("restIntervalMap") as FormArray
  }


  get workIntervalMap() : FormArray{
    return this.Form.get("workIntervalMap") as FormArray
  }

    //workouts
    async getExercises(){
      const workoutRef = this.db.firestore.collection('Exercises');
      this.unsubExercise = await workoutRef
      .onSnapshot((querySnapshot) => {
        var data:any =[]
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        this.exerciseList = this.searchOptions = data;
      }, (error) => {
        console.log("erroe",error)
      });
    }
  
    async getExercisesWC(){
      const workoutRef = this.db.firestore.collection('WarmUpCoolDownExercises');
      this.unsubExerciseWC = await workoutRef
      .onSnapshot((querySnapshot) => {
        var data:any =[]
        querySnapshot.forEach(doc => {
          data.push(doc.data());
        });
        this.exerciseListWC = this.exerciseListCD=this.searchOptionsWC = data;
      }, (error) => {
        console.log("erroe",error)
      });
    }

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
            thumbnail: res
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
    let data = [{image:this.Form.value.thumbnail}];
    // console.log(data)
    Promise.all(
      data.map(async (res,index)=>{
        return new Promise(async(resolve, reject) => {
          if(typeof res.image === 'object')  {
            // const randomId = Math.random().toString(36).substring(2);
            const ref = this.afStorage.ref(`Workouts/${this.Form.value.id}/thumbnail`);
            const task = ref.put(res.image);
            this.uploadProgress = task.percentageChanges();
            (await task).ref.getDownloadURL()
            .then((res)=>{
                  this.Form.patchValue({
                    thumbnail: res
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
      const filters = this.Form.value.filters;
      let workoutProcessType = '';
      if(filters.includes('strength'))
        workoutProcessType = 'oneByOne'
      else if(filters.includes('circuit'))
        workoutProcessType = 'circular'
      else if(filters.includes('interval'))
        workoutProcessType = 'onlyOne'


      this.http.addEditWorkout({...this.Form.value,workoutProcessType}).subscribe((res)=>{
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
          this.exerciseList = res;
          console.log(this.exerciseList)
        }
      })
    }
      
  
    private _filter(name: string): any[] {
      const filterValue = name.toLowerCase();
      return this.searchOptions.filter((option:any) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    //* *//

    //search
    applyWarmUpSearch(){
      this.filteredOptionsWC = this.selectedItemWC.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter2(name) : this.searchOptionsWC.slice())
      );
      this.filteredOptionsWC.subscribe(res=>{
        console.log(res)
        if(res.length > 0) {
          this.exerciseListWC = res;
        }
      })
    }
      
  
    private _filter2(name: string): any[] {
      const filterValue = name.toLowerCase();
      return this.searchOptionsWC.filter((option:any) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    //* *//

    //search colldown
    applyCoolDownSearch(){
      this.filteredOptionsCD = this.selectedItemCD.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter3(name) : this.searchOptionsWC.slice())
      );
      this.filteredOptionsCD.subscribe(res=>{
        console.log(res)
        if(res.length > 0) {
          this.exerciseListCD = res;
        }
      })
    }
      
  
    private _filter3(name: string): any[] {
      const filterValue = name.toLowerCase();
      return this.searchOptionsWC.filter((option:any) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    //* *//

    onChangeModel(model:string,type:string){
      // let data =[]
      // data = this.searchOptionsWC.filter((exercise)=>{
      //   let matchVideo = exercise.videoUrls.filter((video: any)=>video.model === model);
      //   if(matchVideo.length > 0)
      //     return true;
      //   else
      //     return false;

      // });
      if(type === 'WC')
        this.selectedModelWC = model;
      else if(type === 'CD')
        this.selectedModelCD = model;
      else
        this.selectedModel = model;

    }

    checkExerciseContainModel(data:any,type:string){
      let matchVideo = data.videoUrls.filter((video: any)=>{
        if(type === 'WC'){
          return video.model === this.selectedModelWC
        }else if(type === 'CD'){
          return video.model === this.selectedModelCD
        }
        else{
          return video.model === this.selectedModel
        }
         
      });
      if(matchVideo.length > 0)
        return true;
      else
        return false;
    }

    
}
