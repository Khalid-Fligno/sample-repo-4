import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsRoutingModule } from './workouts-routing.module';
import { WorkoutsComponent } from './workouts.component';
import { ViewComponent } from './components/view/view.component';
import { EditComponent } from './components/edit/edit.component';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  declarations: [WorkoutsComponent, ViewComponent, EditComponent],
  imports: 
  [
    CommonModule,
    WorkoutsRoutingModule,
    SharedModule
  ]
})

export class WorkoutsModule { }
