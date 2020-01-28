import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TransceiverComponent} from './transceiver.component';

describe('TransceiverComponent', () => {
    let component: TransceiverComponent;
    let fixture: ComponentFixture<TransceiverComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TransceiverComponent]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TransceiverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('should create', async () => {
        expect(component).toBeTruthy();
    });

    it('should have <h5> with "80m Single Band Transceiver"', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const h5 = bannerElement.querySelector('h5');
        expect(h5.textContent.trim()).toEqual('80m Single Band Transceiver');
    });

    it('should have <p> with "A superheterodyne transceiver with single frequency conversion and 9MHz crystal IF filter:"', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const p = bannerElement.querySelector('p');
        expect(p.textContent.trim()).toEqual('A superheterodyne transceiver with single frequency conversion and 9MHz crystal IF filter:');
    });

    it('should have <ul>', async () => {
        const bannerElement: HTMLElement = fixture.nativeElement;
        const ul = bannerElement.querySelector('ul');
        expect(ul).toBeDefined();
        expect(ul.childElementCount).toBe(3);
    });
});
