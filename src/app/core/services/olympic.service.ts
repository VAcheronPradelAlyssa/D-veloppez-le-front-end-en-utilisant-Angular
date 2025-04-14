import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { OlympicCountry } from '../models/Olympic';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private dataLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        console.log('Données initiales chargées:', value);
        this.olympics$.next(value);
        this.dataLoaded$.next(true); // Indiquer que les données sont chargées
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des données initiales:', error);
        this.olympics$.next([]);
        this.dataLoaded$.next(false); // Indiquer que les données ne sont pas chargées
        return throwError(() => new Error(`Erreur lors du chargement des données initiales : ${error.message}`));
      })
    );
  }

  getCountryById(id: number): Observable<OlympicCountry | undefined> {
    return this.dataLoaded$.pipe(
      filter(loaded => loaded), // Attendre que les données soient chargées
      switchMap(() => this.olympics$.asObservable().pipe(
        map((countries) => {
          const country = countries.find(c => c.id === id);
          if (!country) {
            console.log(`Aucun pays trouvé pour l'ID: ${id}`);
          }
          return country;
        })
      ))
    );
  }

  getOlympics() {
    return this.olympics$.asObservable().pipe(
      filter(olympics$ => olympics$ && olympics$.length > 0)
    );
  }
}
