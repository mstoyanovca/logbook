import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbDatepickerModule, NgbPaginationModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

import {AppComponent} from './app.component';
import {SignalGeneratorComponent} from './signal-generator/signal-generator.component';
import {VfoComponent} from './vfo/vfo.component';
import {TransceiverComponent} from './transceiver/transceiver.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LoginComponent} from './login/login.component';
import {LogBookComponent} from './log-book/log-book.component';
import {RequestQslComponent} from './request-qsl/request-qsl.component';
import {QslComponent} from './qsl/qsl.component';
import {AppRoutingModule} from './app-routing.module';
import {ErrorInterceptor} from './interceptor/error.interceptor';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {environment} from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        SignalGeneratorComponent,
        VfoComponent,
        TransceiverComponent,
        PageNotFoundComponent,
        LoginComponent,
        LogBookComponent,
        RequestQslComponent,
        QslComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'}),
        NgbTimepickerModule,
        NgbDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
        AngularFontAwesomeModule,
        AppRoutingModule,
        LoggerModule.forRoot({
            level: environment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.LOG,
            serverLogLevel: NgxLoggerLevel.OFF
        })
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        // {provide: HTTP_INTERCEPTORS, useClass: BackendInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
