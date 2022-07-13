import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../security/auth.guard';
import { LogbookComponent } from './logbook.component';

const routes: Routes = [{ path: 'logbook', title: 'Logbook', component: LogbookComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogbookRoutingModule { }
