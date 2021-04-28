import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { HttpService } from 'src/app/http.service';
import { EditExerciseComponent } from './Components/edit-exercise/edit-exercise.component';
import { ViewExerciseComponent } from './Components/view-exercise/view-exercise.component';



@Component({
  selector: 'app-exercises',
  templateUrl: './wcExercises.component.html',
  styleUrls: ['./wcExercises.component.scss']
})

export class WCExercisesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'view', 'edit','delete'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = true;
  uploadProgress:any
  uploadURL:any;
  unsubExercise:any;

  //search
  selectedItem = new FormControl();
  searchOptions:any=[];
  filteredOptions!: Observable<any>;
  //*** */

  constructor
  (
    private http:HttpService,
    public dialog: MatDialog,
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService
  ) 
  { 
    this.http.currentPage="Warm Up and Cool down Exercises";
  }

  async getExercises(){
    const exerciseRef = this.db.firestore.collection('WarmUpCoolDownExercises');
    this.unsubExercise = await exerciseRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      this.isLoading = false;
      this.spinner.hide();
      if(data.length >0){
        this.searchOptions = [...data];
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;

      }
    }, 
    (error) => {
      console.log("erroe",error)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getExercises();
    this.applySearch();
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
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
    })
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.searchOptions.filter((option:any) => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  //** */

  ngOnDestroy(){
    this.unsubExercise();
  }

  viewExercise(data:any) {
    const dialogRef = this.dialog.open(ViewExerciseComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  editExercise(data:any=null) {
    const dialogRef = this.dialog.open(EditExerciseComponent,{
      data:data,
      width: '100vw'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteExercise(data:any=null) {
    // console.log(data)
    const dialogRef = this.dialog.open(AlertComponent,{
      data:{
        title:"Are you sure!",
        subTitle:"Do you want to delete this exercise"
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.spinner.show();
        this.http.deleteWCExercise(data).subscribe(res=>{
          this.spinner.hide();
          this.dialog.open(SuccessComponent,{data:{title:"Deleted!",subTitle:"Recipe deleted successfully."}});
        })
      }
    });
  }
}
