import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données initiales depuis le mock Json
   * @returns un observable de des données 
   */

  loadInitialData(): Observable<OlympicCountry[]> {
    this.loading$.next(true);
    this.error$.next(null);

    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.loading$.next(false);
      }),
      catchError((error) => {
        console.error('Error loading Olympic data', error);
        this.olympics$.next([]);
        this.loading$.next(false);
        this.error$.next('Failed to load Olympic data. Please try again later.');
        return throwError(() => new Error('Failed to load Olympic data'));
      })
    );
  }

  /**
   * Récupère les données actuelles
   * @returns observable données
   */
  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }

  /**
   * Obtenir un pays olympique par ID
   * @param id - Id du pays récupérer
   * @returns observable du pays ou undefined si pas trouvé
   */
  getCountryById(id: number): Observable<OlympicCountry | undefined> {
    return this.olympics$.asObservable().pipe(
      map((countries) => countries.find(c => c.id === id))
    );
  }

  /**
   * Obtenir état de chargement 
   * @returns  observable de l'état de chargement
   */
  getLoadingStatus(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Obtenier état des erreurs
   * @returns observable du m'essage d'erreur ou null si pas d'erreur
   */
  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }
}