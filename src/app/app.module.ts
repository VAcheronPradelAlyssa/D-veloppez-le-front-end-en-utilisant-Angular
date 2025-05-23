import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieComponent } from './component/pie/pie.component';
import { DetailsComponent } from './pages/details/details.component';
import { LineComponent } from './component/line/line.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, DashboardComponent,PieComponent, DetailsComponent,LineComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgxChartsModule,BrowserAnimationsModule, NoopAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
  