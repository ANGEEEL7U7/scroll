import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ReporteCaseta } from './app.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private _http: HttpClient) {}

  obtenerDatos(): Observable<ReporteCaseta[]> {
    return this._http.get<ReporteCaseta[]>(
      'assets/registros_tabla_caseta_1000.json',
    );
  }
}
