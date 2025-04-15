import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: false
})
export class NotFoundComponent implements OnInit {
  public errorMessage: string | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupère le message de l'état passé lors de la navigation
    const navigationState = history.state.message;
    if (navigationState) {
      this.errorMessage = navigationState;
    } else {
      this.errorMessage = 'Page non trouvée.';
    }
  }
}
