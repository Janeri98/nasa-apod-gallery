import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NasaApiService } from '../../services/nasa-api'; 
import { APOD } from '../../models/apod';

@Component({
  selector: 'app-apod-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apod-list.html',
  styleUrls: ['./apod-list.css']
})
export class ApodListComponent implements OnInit {
  apods: APOD[] = [];
  filteredApods: APOD[] = [];
  loading = false;
  error = '';
  
  filterType: 'single' | 'range' | 'count' = 'single';
  singleDate: string = '';
  startDate: string = '';
  endDate: string = '';
  count: number = 10;

  constructor(
    private nasaApiService: NasaApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDefaultAPODs();
  }

  loadDefaultAPODs(): void {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 9);
    
    this.startDate = startDate.toISOString().split('T')[0];
    this.endDate = endDate;
    this.searchAPODs();
  }

  searchAPODs(): void {
    this.loading = true;
    this.error = '';

    let apodObservable;

    switch (this.filterType) {
      case 'single':
        if (this.singleDate) {
          apodObservable = this.nasaApiService.getAPOD(this.singleDate);
          apodObservable.subscribe({
            next: (apod) => {
              this.apods = [apod];
              this.filteredApods = [...this.apods];
              this.loading = false;
            },
            error: (error) => this.handleError(error)
          });
          return;
        }
        break;

      case 'range':
        if (this.startDate && this.endDate) {
          apodObservable = this.nasaApiService.getAPODRange(this.startDate, this.endDate);
          break;
        }
        this.loading = false;
        return;

      case 'count':
        apodObservable = this.nasaApiService.getAPODCount(this.count);
        break;

      default:
        this.loading = false;
        return;
    }

    if (apodObservable) {
      apodObservable.subscribe({
        next: (apods) => {
          this.apods = apods;
          this.filteredApods = [...apods];
          this.loading = false;
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleError(error: any): void {
    this.error = 'Error al cargar las imágenes. Por favor, intenta nuevamente.';
    this.loading = false;
    console.error('Error:', error);
  }

  viewDetail(apod: APOD): void {
    this.router.navigate(['/apod', apod.date]);
  }

  getImageUrl(apod: APOD): string {
    return apod.media_type === 'video' ? apod.thumbnail_url || apod.url : apod.url;
  }
}