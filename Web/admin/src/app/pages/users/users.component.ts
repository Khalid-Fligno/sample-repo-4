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
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ViewComponent } from './components/view/view.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'view', 'edit','delete'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = true;
  uploadProgress:any
  uploadURL:any;
  unsubUser:any;

  //search
  selectedItem = new FormControl();
  searchOptions:any=[];
  filteredOptions!: Observable<any>;
  //
  searchError:any=null;

  constructor(
    private http:HttpService,
    public dialog: MatDialog,
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService
  ) 
  { 
    this.http.currentPage="Users";
  }

  async getUsers(){
    const usersRef = this.db.firestore.collection('users').limit(50);
    this.unsubUser = await usersRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      console.log(data)
      if(data.length >0){
        console.log("??????")
        this.searchOptions = data;
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      }
      this.spinner.hide();
    }, 
    (error) => {
      console.log("error",error)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getUsers();
    // this.applySearch();
  }

  //search
  applySearch(){
    this.filteredOptions = this.selectedItem.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.firstName),
      map(firstName => firstName ? this._filter(firstName) : this.searchOptions.slice())
    );
    this.filteredOptions.subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
    })
  }

  private _filter(firstName: string): any[] {
    const filterValue = firstName.toLowerCase();
    console.log(this.searchOptions);
    return this.searchOptions.filter((option:any) => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(){
    this.unsubUser();
  }

  viewUser(data:any) {
    const dialogRef = this.dialog.open(ViewComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editUser(data:any=null) {
    const dialogRef = this.dialog.open(AddComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteUser(data:any=null) {
    console.log(data)
    const dialogRef = this.dialog.open(AlertComponent,{
      data:{
        title:"Are you sure!",
        subTitle:"Do you want to delete this User"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.spinner.show();
        this.http.deleteUser(data).subscribe(res=>{
          this.spinner.hide();
          this.dialog.open(SuccessComponent,{data:{title:"Deleted!",subTitle:"User deleted successfully."}});
        })
      }
    });
  }


async  searchByEmail(){
    this.isLoading = true;
    const usersRef = this.db.firestore.collection('users');
    var data = await usersRef.where('email',"==",this.selectedItem.value).get();

    if(data.docs.length === 0){
        this.dialog.open(SuccessComponent,{data:{title:"Not found!",subTitle:"User not found with this email in db"}});
    }
    data.docs.forEach((res)=>{
      var data:Array<any> =[];
      console.log(res.data())
      data.push(res.data());
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
      this.searchError = ""

    })
  }
}
