import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {QSO} from '../model/qso';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})

export class QsoService {
    private qsosUrl = 'qso';

    constructor(
        private http: HttpClient,
        private logger: NGXLogger) {
    }

    findAll(): Observable<QSO[]> {
        return this.http.get<QSO[]>(this.qsosUrl).pipe(
            tap(response => {
                response.forEach(r => r.dateTime = new Date(r.dateTime));
                this.logger.log('findAll()')
            }),
            catchError(this.handleError('findAll', []))
        )
    }

    findByDateTimeAndCallsign(dateTime: Date, callsign: string): Observable<QSO[]> {
        const url = `${this.qsosUrl}?date=${dateTime}&callsign=${callsign}`;

        return this.http.get<QSO[]>(url).pipe(
            tap(_ => this.logger.log(`findByDateTimeAndCallsign(${dateTime}, ${callsign})`)),
            catchError(this.handleError('findByDateTimeAndCallsign', []))
        );
    }

    add(qso: QSO): Observable<QSO> {
        return this.http.post<QSO>(this.qsosUrl, qso, httpOptions).pipe(
            tap(response => {
                response.dateTime = new Date(response.dateTime);
                this.logger.log(`Added a new qso: ${JSON.stringify(response)}`);
            }),
            catchError(this.handleError<QSO>('add', null))
        );
    }

    delete(qso: QSO): Observable<{}> {
        const url = `${this.qsosUrl}/${qso.id}`;

        return this.http.delete<QSO>(url, httpOptions).pipe(
            tap(_ => this.logger.log(`Deleted a qso: ${JSON.stringify(qso)}`)),
            catchError(this.handleError<QSO>('delete'))
        );
    }

    private handleError<T>(operation: String, result?: T) {
        return (error: any): Observable<T> => {
            this.logger.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
