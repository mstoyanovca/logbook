import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {SignalGeneratorComponent} from "./signal-generator/signal-generator.component";
import {VfoComponent} from "./vfo/vfo.component";
import {TransceiverComponent} from "./transceiver/transceiver.component";
import {LogBookComponent} from "./log-book/log-book.component";
import {AuthenticationGuard} from "./authentication-guard/authentication.guard";
import {RequestQslComponent} from "./request-qsl/request-qsl.component";
import {QslComponent} from "./qsl/qsl.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {NgbDatepickerModule, NgbPaginationModule, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularFontAwesomeModule} from "angular-font-awesome";
import {AppRoutingModule} from "./app-routing.module";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {environment} from "../environments/environment";
import {JwtInterceptor} from "./interceptor/jwt.interceptor";
import {ErrorInterceptor} from "./interceptor/error.interceptor";

describe('AppComponent', () => {
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
    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
            ]
        }).compileComponents();
    }));

    it('should create the app', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render title in a h1 tag', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toEqual('VA3AUI');
    });
});
