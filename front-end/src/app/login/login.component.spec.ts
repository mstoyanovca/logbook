import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerConfig, LoggerTestingModule, NGXLogger} from 'ngx-logger';
import {By} from '@angular/platform-browser';
import {AuthenticationService} from "../service/authentication.service";

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                FormsModule,
                HttpClientTestingModule,
                LoggerTestingModule
            ],
            providers: [
                NGXLogger,
                LoggerConfig,
                AuthenticationService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('should create', async () => {
        expect(component).toBeTruthy();
    });

    it('should have <div> with id="left-panel"', async () => {
        expect(fixture.nativeElement.querySelector('#left-panel')).toBeDefined();
    });

    it('should have <div> with id="center-panel"', async () => {
        expect(fixture.nativeElement.querySelector('#center-panel')).toBeDefined();
    });

    it('should have <div> with id="right-panel"', async () => {
        expect(fixture.nativeElement.querySelector('#right-panel')).toBeDefined();
    });

    it('should have three <p> elements', async () => {
        expect(document.getElementsByTagName('p').length).toBe(3);
    });

    it('should have <form> element', async () => {
        const form = fixture.debugElement.query(By.css('form')).nativeElement;
        expect(form.$valid).toBeFalsy();
        expect(form).toBeDefined();
    });

    it('should have <input> element with id="email"', async () => {
        expect(fixture.debugElement.query(By.css('#email')).nativeElement).toBeDefined();
    });

    it('should have <input> element with id="password"', async () => {
        expect(fixture.debugElement.query(By.css('#password')).nativeElement).toBeDefined();
    });

    it('should have <button> element', async () => {
        expect(fixture.debugElement.query(By.css('button')).nativeElement).toBeDefined();
    });

    it('should not display error messages on a pristine <form>', async () => {
        expect(fixture.debugElement.query(By.css('#emailReq'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#pwdReq'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#pwdInv'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#authErr'))).toBeNull();
    });

    it('should display error messages on a touched <form>', async () => {
        fakeAsync(() => {
            const emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
            emailInput.click();
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('#emailReq')).nativeElement).toBeDefined();
            expect(fixture.debugElement.query(By.css('#pwdReq')).nativeElement).toBeDefined();
            expect(fixture.debugElement.query(By.css('#pwdInv')).nativeElement).toBeDefined();
            expect(fixture.debugElement.query(By.css('#authErr')).nativeElement).toBeDefined();
        });
    });

    it('should have not opened any modals', async () => {
        const forgotPasswordModal = fixture.debugElement.query(By.css('#forgotPasswordModal')).nativeElement;
        const changePasswordModal = fixture.debugElement.query(By.css('#changePasswordModal')).nativeElement;

        expect(forgotPasswordModal.height).toBeUndefined();
        expect(changePasswordModal.height).toBeUndefined();
    });

    it('should open the forgotPasswordModal', async () => {
        fakeAsync(() => {
            component.loggedIn = false;
            fixture.detectChanges();

            const forgotPwdBtn = fixture.debugElement.query(By.css('#forgotPwdBtn')).nativeElement;
            forgotPwdBtn.click();
            fixture.detectChanges();

            const forgotPasswordModal = fixture.debugElement.query(By.css('#forgotPasswordModal')).nativeElement;
            const changePasswordModal = fixture.debugElement.query(By.css('#changePasswordModal')).nativeElement;

            expect(forgotPasswordModal.height).toBeGreaterThan(0);
            expect(changePasswordModal.height).toBe(0);
        });
    });

    // layout:
    it('should display all panels in a row on a desktop', async () => {
        const leftPanel = fixture.nativeElement.querySelector('#left-panel');
        const centerPanel = fixture.nativeElement.querySelector('#center-panel');
        const rightPanel = fixture.nativeElement.querySelector('#right-panel');

        expect(leftPanel.classList.contains('col-md-3')).toBe(true);
        expect(centerPanel.classList.contains('col-lg-6')).toBe(true);
        expect(rightPanel.classList.contains('col-lg-3')).toBe(true);
    });

    it('should move the right panel to the bottom on a tablet', async () => {
        const leftPanel = fixture.nativeElement.querySelector('#left-panel');
        const centerPanel = fixture.nativeElement.querySelector('#center-panel');

        window.resizeTo(991, 600);
        fixture.detectChanges();

        expect(leftPanel.classList.contains('col-md-3')).toBe(true);
        expect(centerPanel.classList.contains('col-md-9')).toBe(true);
    });

    it('should display all panels in a column on a phone', async () => {
        const leftPanel = fixture.nativeElement.querySelector('#left-panel');
        const centerPanel = fixture.nativeElement.querySelector('#center-panel');
        const rightPanel = fixture.nativeElement.querySelector('#right-panel');

        window.resizeTo(767, 1000);
        fixture.detectChanges();

        expect(leftPanel.width).toBe(centerPanel.width);
        expect(centerPanel.width).toBe(rightPanel.width);
    });
});
