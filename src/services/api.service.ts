import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public get(path: string, query: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${environment.apiPath}${environment.apiVersion}/${path}${query}`, { headers, params: query });
  }

}
