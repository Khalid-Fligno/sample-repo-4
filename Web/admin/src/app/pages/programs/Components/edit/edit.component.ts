import { Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { HttpService } from 'src/app/http.service';
import { v4 as uuidv4} from 'uuid';
import {COMMA, D, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import * as shortId from 'short-uuid'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent implements OnInit, OnDestroy {

  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  //>>>

  Form: FormGroup;
  Form2!: FormGroup;
  Form3: FormGroup;
  uploadProgress:any;
  unsubRecipe:any;
  unsubWorkout:any;
  recipeList:any=[];
  workoutList:any=[];
  strengthAssessments:any=[];

  //search
  searchOptions:any[]=[];
  selectedItem = new FormControl();
  filteredOptions!: Observable<any>;
  //* *//

  //search workouts
  searchOptionsWorkouts:any[]=[];
  selectedItemWorkouts = new FormControl();
  filteredOptionsWorkouts!: Observable<any>;
  //* *//

  constructor
  (
    private fb:FormBuilder,
    private afStorage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private http:HttpService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<EditComponent>, 
  ) 
  {
    const d = this.data;
    this.Form = this._formBuilder.group({
      id:d && d.id?d.id:uuidv4(),
      displayName: [d && d.displayName?d.displayName:'',Validators.required],
      name: [d && d.name?d.name:''],
      description: [d && d.description?d.description:'',Validators.required],
      availabilityDate: [d && d.availabilityDate?d.availabilityDate:'',Validators.required],
      imageUrl: [d && d.imageUrl?d.imageUrl:'',Validators.required],
      numberOfDays: [d && d.numberOfDays?d.numberOfDays:'',Validators.required],
      numberOfWeeks: [d && d.numberOfWeeks?d.numberOfWeeks:'',Validators.required],
      // productReChargeId:[d && d.productReChargeId?d.productReChargeId:'',Validators.required],
      shopifyProductId:[d && d.shopifyProductId?d.shopifyProductId:'',Validators.required],
      shopifyUrl:[d && d.shopifyUrl?d.shopifyUrl:'',Validators.pattern(this.http.urlRegex)],
      tag: [d && d.tag?d.tag:shortId.generate(),Validators.required],
      strengthAssessmentId: [d && d.strengthAssessmentId, Validators.required]
    });



    this.Form3 = this._formBuilder.group({
      workouts:d && d.workouts?this.fb.array(d.workouts.map((res:any)=>this.newWorkouts(res))): this.fb.array([])
    });
  }

  ngOnInit()
  {
    this.getRecipe();
    this.getWorkout();
    this.applySearch();
    this.applySearchWorkouts();
    this.getStrengthAssessments();
  }

  ngOnDestroy()
  {
    this.unsubRecipe();
    this.unsubWorkout();
  }

  get f(){
    return this.Form.controls;
  }

  //phases
  get phases() : FormArray {
    return this.Form2.get("phases") as FormArray
  }

  newPhase(d:any=null): FormGroup {
    let breakfast,lunch,dinner,snack,drink =[];
    if(this.recipeList.length && d){
      breakfast = this.recipeList.filter((recipe:any)=>d.meals.includes(recipe.id) && recipe.breakfast).map((recipe:any)=>recipe.id);
      lunch = this.recipeList.filter((recipe:any)=>d.meals.includes(recipe.id) && recipe.lunch).map((recipe:any)=>recipe.id);
      dinner = this.recipeList.filter((recipe:any)=>d.meals.includes(recipe.id) && recipe.dinner).map((recipe:any)=>recipe.id);
      snack = this.recipeList.filter((recipe:any)=>d.meals.includes(recipe.id) && recipe.snack).map((recipe:any)=>recipe.id);
      drink = this.recipeList.filter((recipe:any)=>d.meals.includes(recipe.id) && recipe.drink).map((recipe:any)=>recipe.id);
    }

    function maxAllowed(propertyName: string): number {
      return d?.favouriteRecipeConfigs?.[propertyName]?.maximumAllowedFavourites ?? 1
    }

    return this.fb.group({
      displayName: [{value:d && d.displayName?d.displayName:'',disabled:d && d.displayName?true:false},Validators.required],
      name: [d && d.name?d.name:''],
      thumbnail: [d && d.thumbnail?d.thumbnail:'',Validators.required],
      description: [d && d.description?d.description:'',Validators.required],
      startDay: [{value:d && d.startDay?d.startDay:'',disabled:d && d.startDay?true:false},Validators.required],
      endDay: [{value:d && d.endDay?d.endDay:'',disabled:d && d.endDay?true:false},Validators.required],
      pdfUrl: [d && d.pdfUrl?d.pdfUrl:'',Validators.required],
      // meals: [d && d.meals?d.meals:'',Validators.required],
      breakfast:[d && d.meals?breakfast:'',Validators.required],
      breakfastMaxAllowedFavourites: [maxAllowed('breakfast'), Validators.required],
      lunch:[d && d.meals?lunch:'',Validators.required],
      lunchMaxAllowedFavourites: [maxAllowed('lunch'), Validators.required],
      dinner:[d && d.meals?dinner:'',Validators.required],
      dinnerMaxAllowedFavourites: [maxAllowed('dinner'), Validators.required],
      snack:[d && d.meals?snack:'',Validators.required],
      snackMaxAllowedFavourites: [maxAllowed('snack'), Validators.required],
      drink:[d && d.meals?drink:''],
      drinksMaxAllowedFavourites: [maxAllowed('drink'), Validators.required]
    })
  }

  addPhase() {
    this.phases.push(this.newPhase());
  }

  removePhase(i:number) {
    this.phases.removeAt(i);
  }

  //workouts
  newWorkouts(d:any=null): FormGroup {
    return this.fb.group({
      id: [d && d.id?d.id:'',Validators.required],
      days: [d && d.days?d.days:[],Validators.required],
    })
  }

  get workouts() : FormArray {
    return this.Form3.get("workouts") as FormArray
  }

  addWorkout() {
    this.workouts.push(this.newWorkouts());
  }

  removeWorkout(i:number) {
    this.workouts.removeAt(i);
  }


  //days
  addDay(event: MatChipInputEvent,i:number): void {
    const input = event.input;
    const value = event.value;
    // Add our days
    if ((value || '').trim()) {
      var ref = this.workouts.at(i).get("days") as FormArray;
      let tmpData  = ref.value
      tmpData.push(Number(value.trim()));
      ref.patchValue(tmpData);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeDay(day: any,i:number): void {
    var ref = this.workouts.at(i).get("days") as FormArray;
    let tmpData  = ref.value
    const index = tmpData.indexOf(day);
    if (index >= 0) {
      tmpData.splice(index, 1);
      ref.patchValue(tmpData);
    }
  }

  getDays(i:number){
    var ref =  this.workouts.at(i).get("days") as FormArray;
    return ref.value;
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

  async onFileChange(event:any) 
  {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) 
    {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = async() => {
        const base64Response = await fetch(reader.result as string);
        await base64Response.blob().then((res)=>{
          this.Form.patchValue({
            imageUrl: res
          });
        })
      };
    }
  }

  async onFileChange2(event:any,index:any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = async() => {
        const base64Response = await fetch(reader.result as string);
        // var blob = base64Response.blob()._W;
        // console.log(reader.result as string);
        await base64Response.blob().then((res)=>{
          this.phases.at(index)
           .patchValue({
            thumbnail: res
          });
        })
      };
    }
  }

  onSubmit(){
    this.spinner.show();

    let str:string = this.Form.value.shopifyUrl;
    str = str.substring(0,4);
    if(str != 'http'){
      let url = 'http://'+this.Form.value.shopifyUrl;
      this.Form.value.shopifyUrl = url;
    }

    this.upload();
  }

  async upload() {
    let data = [{image:this.Form.value.imageUrl}];
    this.Form2.value.phases.forEach((element:any) => {
        data.push({image:element.thumbnail})
    });
    Promise.all(
      data.map(async (res,index)=>{
        return new Promise(async(resolve, reject) => {
          if(typeof res.image === 'object')
          {
            const ref = this.afStorage.ref(`Programs/${this.Form.value.id}/${index === 0?'imageUrl':'phase'+index}`);
            const task = ref.put(res.image);
            this.uploadProgress = task.percentageChanges();
            (await task).ref.getDownloadURL()
            .then((res)=>{
              if(index === 0)
                this.Form.patchValue({
                  imageUrl: res
                });
              else  
                this.phases.at(index-1).patchValue({
                  thumbnail:res
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
    .catch(err=>{
      this.spinner.hide();
      alert("Something went wrong please try again.")
      console.log("Error!",err);
    })
  }

  saveData(){
    this.Form.patchValue({
      name:this.Form.value.displayName
    })
    const phasesArray = this.getPhases(this.Form2.getRawValue().phases);
    const  data = {
                    ...this.Form.value,
                    ...{phases:phasesArray},
                    ...this.Form3.value,
                    newChallenge:true,
                    productId:this.Form.value.shopifyProductId,
                    createdAt:new Date().toISOString()
    }
    console.log("sendObj",data)

    this.http.addEditChallenge(data).subscribe((res)=>{
      if(res.success){
       this.dialog.open(SuccessComponent,{
          data:{
            title:"Updated!",
            subTitle:"Program updated successfully."
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

  public objectComparisonFunction = function( option:any, value:any ) : boolean {
    return option.id === value.id;
  }

  async getStrengthAssessments() {
    const strengthAssessmentsDocs = await this.db.firestore.collection('strengthAssessments').get()
    this.strengthAssessments = strengthAssessmentsDocs
      .docs
      .map(doc => doc.data())
  }

  async getRecipe(){
    const recipeRef = this.db.firestore.collection('recipes');
    this.unsubRecipe = await recipeRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      // console.log(phaseMeals)
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
    if(data.length >0){
      this.recipeList = this.searchOptions = data;
      //TODO: Adding phases after fetching recipes

      const d = this.data;
      this.Form2 = this._formBuilder.group({
        phases:d && d.phases?this.fb.array(d.phases.map((res:any)=>this.newPhase(res))): this.fb.array([])
      });
      // console.log(this.recipeList)
    }
    }, (error) => {
      console.log("erroe",error)
    });
  }

  async getWorkout(){
    const recipeRef = this.db.firestore.collection('newWorkouts');
    this.unsubWorkout = await recipeRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[]
      querySnapshot.forEach(doc => {
          data.push(doc.data());
      });
    if(data.length >0){
      this.workoutList = this.searchOptionsWorkouts = data;
      // console.log(this.workoutList)
    }
    }, (error) => {
      console.log("error",error)
    });
  }

  //search for recipes
  applySearch(){
    this.filteredOptions = this.selectedItem.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.title),
      map(title => title ? this._filter(title) : this.searchOptions.slice())
    );
    this.filteredOptions.subscribe(res=>{
          this.recipeList = res;
    })
  }
  private _filter(title: string): any[] {
    const filterValue = title.toLowerCase();
    return this.searchOptions.filter((option:any) => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
  //** */

  //search for workouts
  applySearchWorkouts(){
    this.filteredOptionsWorkouts = this.selectedItemWorkouts.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.displayName),
      map(displayName => displayName ? this.__filter(displayName) : this.searchOptionsWorkouts.slice())
    );
    this.filteredOptionsWorkouts.subscribe(res=>{
          this.workoutList = res;
    })
  }

  private __filter(displayName: string): any[] {
    const filterValue = displayName.toLowerCase();
    return this.searchOptionsWorkouts.filter((option:any) => option.displayName.toLowerCase().indexOf(filterValue) === 0);
  }
  //** */

  openedChange(e:any){
    if(!e){
      this.selectedItem.patchValue('');
      this.selectedItemWorkouts.patchValue('');
    }
  }

  //Not Used...
  getMealType(meal:any){
    let types = [];
    if(meal.breakfast){
      types.push('Breakfast')
    }
    if(meal.lunch){
      types.push('Lunch')
    }
    if(meal.snack){
      types.push('Snack')
    }
    if(meal.dinner){
      types.push('Dinner')
    }
    return types.toString();
  }

  getPhases(phases:any){
    const meals = [...new Set([...this.Form2.value.phases[0].breakfast,
      ...this.Form2.value.phases[0].lunch,
      ...this.Form2.value.phases[0].dinner,
      ...this.Form2.value.phases[0].snack,
      ...this.Form2.value.phases[0].drink
    ])];

    return phases.map((res:any)=>{
        const meals = [...new Set([...res.breakfast,...res.lunch,...res.dinner,...res.snack,...res.drink])];
        return {
                  displayName: res.displayName,
                  name: res.name,
                  thumbnail:res.thumbnail ,
                  description:res.description ,
                  startDay:res.startDay,
                  endDay:res.endDay ,
                  pdfUrl:res.pdfUrl,
                  favouriteRecipeConfigs: {
                    breakfast: {
                      maximumAllowedFavourites: res.breakfastMaxAllowedFavourites
                    },
                    lunch: {
                      maximumAllowedFavourites: res.lunchMaxAllowedFavourites
                    },
                    dinner: {
                      maximumAllowedFavourites: res.dinnerMaxAllowedFavourites
                    },
                    snack: {
                      maximumAllowedFavourites: res.snackMaxAllowedFavourites
                    },
                    drink: {
                      maximumAllowedFavourites: res.drinksMaxAllowedFavourites
                    }
                  },
                  meals: meals
              }
    })
  }

  getTotalSelected(type:any,index:number){
    const phase = this.Form2.value.phases[index];
    if(this.recipeList.length === 0 || !phase[type]){
      return []
    }
    // console.log("????",phase[type])
    return phase[type].filter((id:any)=>{
      const recipe = this.recipeList.find((recipe:any)=>recipe.id === id);
      if(recipe && recipe[type])
        return recipe[type]
      else
        return false
    })
  }
}
