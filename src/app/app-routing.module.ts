import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { DetailsComponent } from './pages/details/details.component';


const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },  
  { path: '', component: DashboardComponent },
  {
    path:'details/:id',
    component: DetailsComponent,
  },
  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}