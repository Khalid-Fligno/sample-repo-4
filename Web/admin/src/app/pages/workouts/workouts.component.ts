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
import { EditComponent } from './components/edit/edit.component';
import { ViewComponent } from './components/view/view.component';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.scss']
})

export class WorkoutsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'view', 'edit','delete'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = true;
  unsubWorkouts:any;

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
    this.http.currentPage="Workouts";
  }

  async getWorkouts(){
    const workoutRef = this.db.firestore.collection('newWorkouts');
    this.unsubWorkouts = await workoutRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[]
      querySnapshot.forEach(doc => {
        if(doc.data().newWorkout)
        data.push(doc.data())
      });
      
      if(data.length >0){
        this.searchOptions = data;
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
      this.spinner.hide();
    }, (error) => {
      this.isLoading = false;
      this.spinner.hide();
      console.log("erroe",error)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.spinner.show();
    this.getWorkouts();
    this.applySearch();
  }

  ngOnDestroy(){
    this.unsubWorkouts();
  }

  viewWorkout(data:any) {
    const dialogRef = this.dialog.open(ViewComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  editWorkout(data:any=null) {
    const dialogRef = this.dialog.open(EditComponent,{
      data:data,
      width: '100vw'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  deleteWorkout(data:any=null) {
    console.log(data)
    const dialogRef = this.dialog.open(AlertComponent,{
      data:{
        title:"Are you sure!",
        subTitle:"Do you want to delete this workout"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.spinner.show();
        this.http.deleteWorkout(data).subscribe(res=>{
          this.spinner.hide();
          this.dialog.open(SuccessComponent,{data:{title:"Deleted!",subTitle:"Workout deleted successfully."}});
        })
      }
    });
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
  
      return this.searchOptions.filter((option:any) => option.displayName.toLowerCase().indexOf(filterValue) === 0);
    }
    //** */

}
