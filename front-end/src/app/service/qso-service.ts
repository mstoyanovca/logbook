import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {QSO} from '../model/qso';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {QsoDate} from '../model/qso-date';
import {QsoTime} from '../model/qso-time';
import {NGXLogger} from 'ngx-logger';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class QsoService {
  private qsosUrl = 'qsos';

  constructor(
    private http: HttpClient,
    private logger: NGXLogger) {
  }

  findAll(): Observable<QSO[]> {
    return this.http.get<QSO[]>(this.qsosUrl).pipe(
      tap(_ => this.logger.log('findAll()')),
      catchError(this.handleError('findAll', []))
    );
  }

  findByDateTimeAndCallsign(date: QsoDate, time: QsoTime, callsign: string): Observable<QSO[]> {
    const url = `${this.qsosUrl}?date=${date}&time=${time}&callsign=${callsign}`;

    return this.http.get<QSO[]>(url).pipe(
      tap(_ => this.logger.log(`findByDateTimeAndCallsign(${date}, ${time}, ${callsign})`)),
      catchError(this.handleError('findByDateTimeAndCallsign', []))
    );
  }

  add(qso: QSO): Observable<QSO> {
    qso.name = qso.name.trim();
    qso.qth = qso.qth.trim();
    qso.notes = qso.notes.trim();

    return this.http.post<QSO>(this.qsosUrl, qso, httpOptions).pipe(
      tap((newQso: QSO) => this.logger.log(`Added a qso with id = ${newQso.id}`)),
      catchError(this.handleError<QSO>('add'))
    );
  }

  delete(qso: QSO): Observable<QSO> {
    const url = `${this.qsosUrl}/${qso.id}`;

    return this.http.delete<QSO>(url, httpOptions).pipe(
      tap(_ => this.logger.log(`Deleted a qso with id = ${qso.id}`)),
      catchError(this.handleError<QSO>('delete'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logger.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
