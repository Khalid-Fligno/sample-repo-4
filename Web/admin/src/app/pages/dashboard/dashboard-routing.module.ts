import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    
    children:[
      {
        path:'',
        redirectTo:"home"
      },
      {
        path:'home',
        loadChildren:()=> import('../home/home.module').then( m => m.HomeModule)
      },
      {
        path:'recipes',
        loadChildren:()=> import('../recipes/recipes.module').then( m => m.RecipesModule)
      },
      {
        path:'exercises',
        loadChildren:()=> import('../exercises/exercises.module').then( m => m.ExercisesModule)
      },
      {
        path:'workouts',
        loadChildren:()=> import('../workouts/workouts.module').then( m => m.WorkoutsModule)
      },
      {
        path:'blogs',
        loadChildren:()=> import('../blogs/blogs.module').then( m => m.BlogsModule)
      },
      {
        path:'programs',
        loadChildren:()=> import('../programs/programs.module').then( m => m.ProgramsModule)
      },
      {
        path:'users',
        loadChildren:()=> import('../users/users.module').then( m => m.UsersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
