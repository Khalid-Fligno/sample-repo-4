import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramsRoutingModule } from './programs-routing.module';
import { ProgramsComponent } from './programs.component';
import { ViewComponent } from './Components/view/view.component';
import { EditComponent } from './Components/edit/edit.component';
import { SharedModule } from 'src/app/components/shared/shared.module';


@NgModule({
  declarations: [ProgramsComponent, ViewComponent, EditComponent],
  imports: 
  [
    CommonModule,
    ProgramsRoutingModule,
    SharedModule
  ]
})

export class ProgramsModule { }
