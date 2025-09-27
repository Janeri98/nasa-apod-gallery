import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APOD } from '../models/apod';

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  private apiUrl = 'https://api.nasa.gov/planetary/apod';
  private apiKey = 'DEMO_KEY'; 

  constructor(private http: HttpClient) { }

  getAPOD(date?: string): Observable<APOD> {
    let params = new HttpParams().set('api_key', this.apiKey);
    
    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<APOD>(this.apiUrl, { params });
  }

  getAPODRange(start_date: string, end_date: string): Observable<APOD[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start_date', start_date)
      .set('end_date', end_date);

    return this.http.get<APOD[]>(this.apiUrl, { params }).pipe(
      map(apods => apods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    );
  }

  getAPODCount(count: number): Observable<APOD[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('count', count.toString())
      .set('thumbs', 'true');

    return this.http.get<APOD[]>(this.apiUrl, { params });
  }
}