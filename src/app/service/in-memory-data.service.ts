import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {QsoFactory} from './qso-factory';

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const qsos =  QsoFactory.createQsos();
    return {qsos};
  }
}
