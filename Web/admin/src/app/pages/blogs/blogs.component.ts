import { ValueConverter } from '@angular/compiler/src/render3/view/template';
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
import { EditComponent } from './Components/edit/edit.component';
import { ViewComponent } from './Components/view/view.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})

export class BlogsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'view', 'edit','delete'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = true;
  uploadProgress:any
  uploadURL:any;
  unsubBlog:any;

  //search
  selectedItem = new FormControl();
  searchOptions:any=[];
  filteredOptions!: Observable<any>;
  //

  constructor(
    private http:HttpService,
    public dialog: MatDialog,
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService
  ) 
  { 
    this.http.currentPage="Blogs";
  }

  async getBlogs(){
    const blogRef = this.db.firestore.collection('Blogs');
    this.unsubBlog = await blogRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[];
      querySnapshot.forEach(doc => {
        data.push(doc.data())
      });
      if(data.length >0){
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
    this.getBlogs();
    this.applySearch();
  }

  //search
  applySearch(){
    this.filteredOptions = this.selectedItem.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.title),
      map(title => title ? this._filter(title) : this.searchOptions.slice())
    );
    this.filteredOptions.subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
    })
  }

  private _filter(title: string): any[] {
    const filterValue = title.toLowerCase();
    console.log(this.searchOptions);
    return this.searchOptions.filter((option:any) => option.title.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(){
    this.unsubBlog();
  }

  viewBlog(data:any) {
    const dialogRef = this.dialog.open(ViewComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editBlog(data:any=null) {
    const dialogRef = this.dialog.open(EditComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteBlog(data:any=null) {
    console.log(data)
    const dialogRef = this.dialog.open(AlertComponent,{
      data:{
        title:"Are you sure!",
        subTitle:"Do you want to delete this blog"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.spinner.show();
        this.http.deleteBlog(data).subscribe(res=>{
          this.spinner.hide();
          this.dialog.open(SuccessComponent,{data:{title:"Deleted!",subTitle:"Blog deleted successfully."}});
        })
      }
    });
  }
}