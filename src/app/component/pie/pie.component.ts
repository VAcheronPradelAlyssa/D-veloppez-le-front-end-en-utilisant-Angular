import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie',
  template: `
  
  <ngx-charts-pie-chart
    [view]="view"
    [results]="pieChartData"
    [legend]="showLegend"
    [labels]="showLabels"
    [doughnut]="doughnut"
    [gradient]="gradient"
    [explodeSlices]="explodeSlices"
    [trimLabels]="trimLabels"
    (select)="onSelect($event)">
  </ngx-charts-pie-chart>
`,
  styleUrls: ['./pie.component.scss'],
  standalone: false
})
export class PieComponent implements OnInit, OnDestroy {
  public pieChartData: any[] = [];
  public view: [number, number] = [700, 500];
  public allCountriesIds: number[] = [];
  public loading: boolean = true;
  public error: boolean = false;
  public errorMessage: string | null = null;

  // Options du graphique
  showLegend = false;
  showLabels = true;
  doughnut = false;
  gradient = false;
  explodeSlices = false;
  trimLabels = false;

  private olympicsSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null;
  private errorSubscription: Subscription | null = null;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateChartDimensions();

    // Abonnement aux données
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe({
      next: (data: OlympicCountry[]) => {
        if (data && data.length > 0) {
          this.pieChartData = data.map((country) => ({
            name: country.country,
            value: this.getTotalMedals(country.participations),
            extra: { countryId: country.id }
          }));
          this.allCountriesIds = data.map(country => country.id);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
      }
    });

    // Abonnement à l'état de chargement
    this.loadingSubscription = this.olympicService.getLoadingStatus().subscribe(
      (loading) => {
        this.loading = loading;
      }
    );

    // Abonnement à l'état d'erreur
    this.errorSubscription = this.olympicService.getError().subscribe(
      (error) => {
        this.error = !!error;
        this.errorMessage = error || "Une erreur est survenue.";
      }
    );
  }

  ngOnDestroy(): void {
    // Annuler les souscriptions pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  private getTotalMedals(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  onSelect(event: any): void {
    const countryId = event.extra.countryId;

    if (!this.allCountriesIds.includes(countryId)) {
      console.error(`Erreur : Le pays avec l'ID ${countryId} n'existe pas.`);
      alert("Ce pays n'existe pas dans notre base de données.");
      return;
    }

    this.router.navigate(['/details', countryId]).catch(err => {
      console.error("Erreur de navigation:", err);
      alert("Impossible d'ouvrir la page des détails. Veuillez réessayer plus tard.");
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateChartDimensions();
  }

  // Taille graphique redéfinie
  private updateChartDimensions(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 600) {
      this.view = [width - 50, height / 2];
    } else if (width < 1024) {
      this.view = [width - 100, height / 2];
    }
  }
}
