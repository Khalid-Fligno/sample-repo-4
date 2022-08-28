import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
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

  @ViewChild('chipList') chipList!: MatChipList;

  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  isImage: boolean = false;
  isStepImage: boolean = false;

  //>>>
  Form: FormGroup;
  uploadProgress: any;
  mealTypeList = [
    {
      label: "breakfast",
      value: "breakfast",
    },
    {
      label: "lunch",
      value: "lunch",
    },
    {
      label: "dinner",
      value: "dinner",
    },
    {
      label: "snack",
      value: "snack",
    },
    {
      label: "post workout",
      value: "drink",
    },
  ];

  filterTagList: any[] = [
    {
      label: 'Vegetarian',
      value: 'V'
    },
    {
      label: 'Vegan',
      value: 'V+'
    },
    {
      label: 'Gluten Free',
      value: 'GF'
    },
    {
      label: 'Dairy Free',
      value: 'DF'
    },
    {
      label: 'Gut Health',
      value: 'GH'
    },
    {
      label: 'Phase 1',
      value: 'P1'
    },
    {
      label: 'Phase 2',
      value: 'P2'
    },
    {
      label: 'Phase 3',
      value: 'P3'
    },
    {
      label: 'Level 1',
      value: 'L1'
    },
    {
      label: 'Level 2',
      value: 'L2'
    },
    {
      label: 'Level 3',
      value: 'L3'
    },
    {
      label: 'Transform Postpartum',
      value: 'PP'
    }
  ];

  constructor
    (
      private fb: FormBuilder,
      private afStorage: AngularFireStorage,
      private sanitizer: DomSanitizer,
      private http: HttpService,
      private spinner: NgxSpinnerService,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditComponent>,
  ) {
    // console.log(this.data)
    const d = this.data;
    let steps = [];
    let types = [];
    if (d && d.steps) {
      steps = d && d.newRecipe ? d.steps : d.steps.map((res: string, i: number) => { return { image: d.stepsImages[i], description: res } });
      types = d && d.newRecipe && d.types ? d.types : this.mealTypeList.map(res => res.value).filter((res: string, i: number) => d[res]);
    }
    console.log(types)
    this.Form = this.fb.group({
      id: d && d.id ? d.id : uuidv4(),
      title: [d && d.title ? d.title : '', Validators.required],
      coverImage: [d && d.coverImage ? d.coverImage : '', Validators.required],
      subtitle: [d && d.subtitle ? d.subtitle : '', Validators.required],
      portions: [d && d.portions ? d.portions : '', Validators.required],
      time: [d && d.time ? d.time : '', Validators.required],
      summary: [d && d.summary ? d.summary : '', Validators.required],
      notes: [d && d.notes ? d.notes : '', Validators.required],
      types: [types && types.length > 0 ? types : '', Validators.required],
      tags: [d && d.tags ? d.tags : []],
      // filterTags: [d && d.filterTags?d.filterTags:[],Validators.required],
      ingredients: d && d.ingredients ? this.fb.array(d.ingredients.map((res: any) => res)) : this.fb.array([]),
      steps: steps && steps.length > 0 ? this.fb.array(steps.map((res: any) => this.newStep(res))) : this.fb.array([]),
      // nutritions:d && d.nutritions?this.fb.array(d.nutritions.map((res:any)=>this.newNutrition(res))): this.fb.array([]) ,
      utensils: d && d.utensils ? this.fb.array(d.utensils.map((res: any) => res)) : this.fb.array([]),
      newRecipe: true
    });
  }

  ngOnInit() {
    console.log(this.data)
    console.log(this.Form.value)
  }

  //form control
  get f() {
    return this.Form.controls;
  }


  //steps
  get steps(): FormArray {
    return this.Form.get("steps") as FormArray
  }

  newStep(data: any = null): FormGroup {
    return this.fb.group({
      image: data ? data.image : null,
      description: data ? data.description : null,
    })
  }

  addStep() {
    this.steps.push(this.newStep());
  }

  removeStep(i: number) {
    this.steps.removeAt(i);
  }


  //nutritions
  get nutritions(): FormArray {
    return this.Form.get("nutritions") as FormArray
  }

  newNutrition(data: any = null): FormGroup {
    return this.fb.group({
      name: data ? data.name : null,
      value: data ? data.value : null,
    })
  }

  addNutrition() {
    this.nutritions.push(this.newNutrition());
  }

  removeNutrition(i: number) {
    this.nutritions.removeAt(i);
  }


  //infredients
  get ingredients(): FormArray {
    return this.Form.get("ingredients") as FormArray
  }

  addIngredients() {
    this.ingredients.push(this.fb.control(''))
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }


  //tags
  get tags(): FormArray {
    return this.Form.get("tags") as FormArray
  }


  //utensils
  get utensils(): FormArray {
    return this.Form.get("utensils") as FormArray
  }

  removeUtensil(i: number) {
    this.utensils.removeAt(i);
  }

  addUtensils() {
    this.utensils.push(this.fb.control(''))
  }


  sanitizedImagePath(blob: any) {
    if (typeof blob === 'object') {
      let objectURL = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
    else
      return blob;
  }

  async onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Response = await fetch(reader.result as string);
        // var blob = base64Response.blob()._W;
        // console.log(reader.result as string);
        await base64Response.blob().then((res) => {
          this.Form.patchValue({
            coverImage: res
          });
        })
      };
      this.isImage = false;
    }
  }

  async onFileChange2(event: any, index: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Response = await fetch(reader.result as string);
        // var blob = base64Response.blob()._W;
        // console.log(reader.result as string);
        await base64Response.blob().then((res) => {
          this.steps.at(index)
            .patchValue({
              image: res
            });
        })
      };
      this.isStepImage = false;
    }
  }


  onSubmit() {
    if (this.Form.valid) {
      this.spinner.show();
      this.upload();
    }
    else {

      if (this.f.coverImage.invalid) {
        this.isImage = true;
      }

      // this.isStepImage = true;
      this.validateAllFields(this.Form);
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  async upload() {
    let data = this.steps.value.length > 0 ? [...this.steps.value] : [];
    data.unshift({ image: this.Form.value.coverImage });
    console.log(data)
    Promise.all(
      data.map(async (res, index) => {
        return new Promise(async (resolve, reject) => {
          if (typeof res.image === 'object') {
            // const randomId = Math.random().toString(36).substring(2);
            const ref = this.afStorage.ref(`Recipes/${this.Form.value.id}/${index === 0 ? 'coverImage' : 'Step' + index}`);
            const task = ref.put(res.image);
            this.uploadProgress = task.percentageChanges();
            (await task).ref.getDownloadURL()
              .then((res) => {
                if (index === 0) {
                  this.Form.patchValue({
                    coverImage: res
                  });
                } else {
                  this.steps.at(index - 1).patchValue({
                    image: res
                  })
                }
                setTimeout(resolve, 0, 'success');
              }

              )
              .catch(err => {
                console.log("Error in uploading", err);
                setTimeout(reject, 0, 'failed');
              })
          } else {
            setTimeout(resolve, 0, 'success');
          }
        })
      })

    )
      .then((res) => {
        console.log(res, "then")
        this.saveData();
      })
      .catch(err => console.log("Error!", err))
  }


  saveData() {
    const Data = Object.assign(
      {}, this.Form.value,
      ...this.mealTypeList.map(
        (mealType: any) => {
          var type = mealType.value
          if (this.Form.value.types.includes(type))
            return { [type]: true }
          else
            return { [type]: false }
        })
    );
    console.log(Data);
    this.http.addEditRecipe(Data).subscribe((res) => {
      if (res.success) {
        this.dialog.open(SuccessComponent, {
          data: {
            title: "Updated!",
            subTitle: "Recipe updated successfully."
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


  //Tags  
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tags
    if ((value || '').trim()) {
      let tmpData = this.tags.value
      console.log(tmpData, value)
      tmpData.push(value.trim());
      this.tags.patchValue(tmpData);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: any): void {

    let tmpData = this.tags.value

    const index = tmpData.indexOf(tag);

    if (index >= 0) {
      tmpData.splice(index, 1);
      this.tags.patchValue(tmpData);

    }
  }
  //Tags  ---
}
