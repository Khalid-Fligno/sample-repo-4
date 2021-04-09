import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ViewComponent } from './components/view/view.component';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  declarations: [UsersComponent, ViewComponent, EditComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})

export class UsersModule { }
