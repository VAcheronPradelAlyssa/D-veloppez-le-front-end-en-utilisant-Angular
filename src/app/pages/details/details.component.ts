import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: false
})
export class DetailsComponent implements OnInit, OnDestroy {
  public country: OlympicCountry | undefined;
  public loading: boolean = true;
  public error: boolean = false;

  private olympicsSubscription: Subscription | null = null;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnDestroy(): void {
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const countryId = this.route.snapshot.paramMap.get('id');

    if (countryId) {
      this.olympicsSubscription = this.olympicService.getCountryById(+countryId).subscribe({
        next: (country) => {
          if (country) {
            this.country = country;
            this.error = false;
          } else {
            this.error = true;
            console.log("caca");
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
          console.error('Erreur:', err);
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  getTotalMedals(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  getTotalAthletes(participations: any[]): number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }
