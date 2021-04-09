import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesComponent } from './exercises.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ViewExerciseComponent } from './Components/view-exercise/view-exercise.component';
import { EditExerciseComponent } from './Components/edit-exercise/edit-exercise.component';


@NgModule({
  declarations: [ExercisesComponent, ViewExerciseComponent, EditExerciseComponent],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    SharedModule
  ]
})

export class ExercisesModule { }
