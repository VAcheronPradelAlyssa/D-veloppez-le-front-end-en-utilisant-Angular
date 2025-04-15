import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-line', 
  template: `
    <ngx-charts-line-chart
      *ngIf="lineChartData.length > 0"
      [view]="view"
      [results]="[{ name: 'Medals', series: lineChartData }]"
      [xAxis]="xAxis"
      [yAxis]="yAxis"
      [showXAxisLabel]="showXAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [showGridLines]="showGridLines"
      [gradient]="gradient"
      [tooltipDisabled]="tooltipDisabled">
    </ngx-charts-line-chart>
  `,
  styleUrls: ['./line.component.scss'],
  standalone: false
})
export class LineComponent implements OnInit, OnDestroy {
  public lineChartData: any[] = [];
  public loading = true;
  public error = false;

  // Configuration du graphique
  xAxis = true;
  yAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Dates';
  showYAxisLabel = true;
  yAxisLabel = 'Total Medals';
  showGridLines = true;
  gradient = false;
  tooltipDisabled = false;
  view: [number, number] = [700, 400];

  private olympicsSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}
  ngOnDestroy(): void {
    // Annuler les souscriptions lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.updateChartDimensions();
  
    const countryId = this.route.snapshot.paramMap.get('id');
  
    if (countryId) {
      this.olympicsSubscription = this.olympicService.getCountryById(+countryId).subscribe({
        next: (country) => {
          if (country) {
            this.lineChartData = this.transformData(country.participations);
          } else {
            this.error = true;
            console.error('Aucun pays trouvé pour cet ID.');
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données:', err);
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }
  

  private transformData(data: any[]): any[] {
    const yearMedalMap = new Map<number, number>();

    data.forEach(participation => {
      const year = participation.year;
      const medalsCount = participation.medalsCount;

      yearMedalMap.set(year, (yearMedalMap.get(year) || 0) + medalsCount);
    });

    return Array.from(yearMedalMap).map(([year, medals]) => ({
      name: year.toString(),
      value: medals
    }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateChartDimensions();
  }

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