import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './security/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { LogbookComponent } from './logbook/logbook.component';

const routes: Routes = [
  { path: 'profile', title: 'Profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'logbook', loadChildren: () => import('./logbook/logbook.module').then(m => m.LogbookModule) },
  { path: '**', title: 'Logbook', component: LogbookComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
