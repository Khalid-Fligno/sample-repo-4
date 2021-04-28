import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WCExercisesComponent } from './wcExercises.component';

const routes: Routes = [
  {
    path:'',
    component:WCExercisesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExercisesRoutingModule { }
