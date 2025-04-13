import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';

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
      [trimLabels]="trimLabels">
    </ngx-charts-pie-chart>
  `,
  styleUrls: ['./pie.component.scss'],
  standalone: false
})
export class PieComponent implements OnInit, OnDestroy {
  public pieChartData: any[] = [];
  public view: [number, number] = [700, 500];

  // Options du graphique
  showLegend = false;
  showLabels = true;
  doughnut = false;
  gradient = false;
  explodeSlices = false;
  trimLabels = false;

  private olympicsSubscription: Subscription | null = null;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.updateChartDimensions();
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe((data: OlympicCountry[]) => {
      if (data) {
        // Construction des données pour le graphique
        this.pieChartData = data.map((country) => ({
          name: country.country,
          value: this.getTotalMedals(country.participations)
        }));
      }
    });
  }

  ngOnDestroy(): void {
    // Annuler les souscriptions lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

  private getTotalMedals(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateChartDimensions();
  }

  //taille graphique redéfnit
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


