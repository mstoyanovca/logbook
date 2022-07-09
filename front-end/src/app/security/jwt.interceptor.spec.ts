import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './security/jwt.interceptor';

describe('JwtInterceptor', () => {
  let service: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
