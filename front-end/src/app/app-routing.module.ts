import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogbookComponent } from './logbook/logbook.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './security/auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'logbook', title: 'Logbook', component: LogbookComponent, canActivate: [AuthGuard] },
  { path: 'profile', title: 'Profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', title: 'Logbook', component: LogbookComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
