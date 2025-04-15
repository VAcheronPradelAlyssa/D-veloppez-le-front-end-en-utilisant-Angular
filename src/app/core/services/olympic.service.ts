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
  private loading$ = new BehaviorSubject<boolean>(false); // État de chargement
  private error$ = new BehaviorSubject<string | null>(null); // État d'erreur

  constructor(private http: HttpClient) {}

  loadInitialData() {
    this.loading$.next(true); // Indiquer que le chargement a commencé
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        console.log('Données initiales chargées:', value);
        this.olympics$.next(value);
        this.dataLoaded$.next(true); // Indiquer que les données sont chargées
        this.loading$.next(false); // Indiquer que le chargement est terminé
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des données initiales:', error);
        this.error$.next('Une erreur est survenue lors du chargement des données.');
        this.olympics$.next([]);
        this.dataLoaded$.next(false); // Indiquer que les données ne sont pas chargées
        this.loading$.next(false); // Indiquer que le chargement est terminé
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

  getLoadingStatus(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }
  getDataLoadedStatus(): Observable<boolean> {
    return this.dataLoaded$.asObservable();
  }
}
