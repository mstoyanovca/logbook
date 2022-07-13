import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogbookRoutingModule } from './logbook-routing.module';
import { LogbookComponent } from './logbook.component';

@NgModule({
  declarations: [
    LogbookComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LogbookRoutingModule
  ]
})
export class LogbookModule { }
