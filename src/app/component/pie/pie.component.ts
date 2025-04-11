import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';

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
export class PieComponent implements OnInit {
  public pieChartData: any[] = [];
  public view: [number, number] = [700, 500];

  // Options du graphique
  showLegend = false;
  showLabels = true;
  doughnut = false;
  gradient = false;
  explodeSlices = false;
  trimLabels = false;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Chargement des données olympiques et construction du jeu de données pour le graphique
    this.olympicService.loadInitialData().subscribe(() => {
      this.olympicService.getOlympics().subscribe((data: OlympicCountry[]) => {
        if (data) {
          this.pieChartData = data.map((country) => ({
            name: country.country,
            value: this.getTotalMedals(country.participations)
          }));
        }
      });
    });
  }

  private getTotalMedals(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }
}
