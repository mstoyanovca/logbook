import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {SignalGeneratorComponent} from './signal-generator/signal-generator.component';
import {VfoComponent} from './vfo/vfo.component';
import {TransceiverComponent} from './transceiver/transceiver.component';
import {LogBookComponent} from './log-book/log-book.component';
import {RequestQslComponent} from './request-qsl/request-qsl.component';
import {QslComponent} from './qsl/qsl.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthenticationGuard} from './authentication-guard/authentication.guard';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signal-generator', component: SignalGeneratorComponent},
    {path: 'vfo', component: VfoComponent},
    {path: 'transceiver', component: TransceiverComponent},
    {path: 'log-book', component: LogBookComponent, canActivate: [AuthenticationGuard]},
    {path: 'request-qsl', component: RequestQslComponent},
    {path: 'qsl', component: QslComponent},
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
