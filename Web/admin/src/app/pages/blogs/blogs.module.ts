import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsComponent } from './blogs.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ViewComponent } from './Components/view/view.component';
import { EditComponent } from './Components/edit/edit.component';

@NgModule({
  declarations: [BlogsComponent, ViewComponent, EditComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    SharedModule
  ]
})

export class BlogsModule { }
