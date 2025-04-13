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

  private olympicsSubscription: Subscription | null = null;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    console.log('Initialisation du DashboardComponent');
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe({
      next: (data: OlympicCountry[]) => {
        console.log('Données reçues dans DashboardComponent:', data); // Vérifie les données reçues
        if (data.length > 0) {
          this.numberOfJOs = this.calculateUniqueYears(data);
          this.numberOfCountries = data.length;
        } else {
          this.noData = true;
        }
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Annuler les souscriptions lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

  // Méthode pour calculer le nombre d'années uniques dans les participations
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