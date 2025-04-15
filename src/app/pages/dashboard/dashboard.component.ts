import { Component, OnInit, OnDestroy } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  public numberOfJOs: number = 0;
  public numberOfCountries: number = 0;
  public loading: boolean = true;
  public noData: boolean = false;
  public olympicsData: OlympicCountry[] = [];

  private olympicsSubscription: Subscription | null = null;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    console.log('Initialisation du DashboardComponent');

    // Vérifier si les données sont déjà présentes dans le BehaviorSubject avant de procéder.
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe({
      next: (data: OlympicCountry[]) => {
        console.log('Données reçues dans DashboardComponent:', data); // Vérifie les données reçues
        
        if (data.length > 0) {
          // Si les données sont présentes, on les stocke dans olympicsData
          this.olympicsData = data;
          this.numberOfJOs = this.calculateUniqueYears(data);
          this.numberOfCountries = data.length;
          this.loading = false;
        } else {
          // Si aucune donnée n'est présente, on affiche un message d'erreur
          this.noData = true;
          this.loading = false;
        }
      },
      error: (err) => {
        // Gestion des erreurs pour l'échec de récupération des données
        console.error('Erreur lors du chargement des données:', err);
        this.loading = false;
        this.noData = true;
      }
    });
  }

  ngOnDestroy(): void {
    // Annuler la souscription pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

  private calculateUniqueYears(countries: OlympicCountry[]): number {
    const years = new Set<number>();
    countries.forEach((country) => {
      country.participations.forEach((participation) => {
        years.add(participation.year);
      });
    });
    return years.size;
  }
}
