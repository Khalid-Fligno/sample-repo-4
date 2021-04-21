import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/http.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from './components/view/view.component';
import { EditComponent } from './components/edit/edit.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit ,AfterViewInit ,OnDestroy {
  displayedColumns: string[] = ['id', 'title', 'view', 'edit','delete'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = true;
  unsubRecipe:any;

  //search
  selectedItem = new FormControl();
  searchOptions:any=[];
  filteredOptions!: Observable<any>;
  //*** */

  constructor(
    private http:HttpService,
    public dialog: MatDialog,
    private db: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService
    ) { 
    this.http.currentPage="Recipes";
    
  }

  async getRecipe(){
  
    const recipeRef = this.db.firestore.collection('Recipes');
    this.unsubRecipe = await recipeRef
    .onSnapshot((querySnapshot) => {
      var data:Array<any> =[]
      querySnapshot.forEach(doc => {
        data.push(doc.data());
        
      });
    if(data.length >0){
      this.searchOptions = [...data];
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
    this.getRecipe();
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
    this.filteredOptions.subscribe(res=>{
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
    })
  }

  private _filter(title: string): any[] {
    const filterValue = title.toLowerCase();
    return this.searchOptions.filter((option:any) => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
  //** */

  ngOnDestroy(){
    this.unsubRecipe();
  }

  viewRecipee(data:any) {
    const dialogRef = this.dialog.open(ViewComponent,{
      data:data,
      width: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  editRecipee(data:any=null) {
    const dialogRef = this.dialog.open(EditComponent,{
      data:data,
      width: '100vw'
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  deleteRecipee(data:any=null) {
    console.log(data)
    const dialogRef = this.dialog.open(AlertComponent,{
      data:{
        title:"Are you sure!",
        subTitle:"Do you want to delete this recipe"
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.spinner.show();
        this.http.deleteRecipe(data).subscribe(res=>{
          this.spinner.hide();
          this.dialog.open(SuccessComponent,{data:{title:"Deleted!",subTitle:"Recipe deleted successfully."}});
        })
      }
    });
  }

}