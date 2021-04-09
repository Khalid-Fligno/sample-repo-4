import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [],
  exports:
  [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
