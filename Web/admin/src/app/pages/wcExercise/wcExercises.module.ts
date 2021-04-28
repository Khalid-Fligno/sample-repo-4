import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './wcExercises-routing.module';
import { WCExercisesComponent } from './wcExercises.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ViewExerciseComponent } from './Components/view-exercise/view-exercise.component';
import { EditExerciseComponent } from './Components/edit-exercise/edit-exercise.component';


@NgModule({
  declarations: [WCExercisesComponent, ViewExerciseComponent, EditExerciseComponent],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    SharedModule
  ]
})

export class wcExercisesModule { }
