import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NasaApiService } from '../../services/nasa-api'; // Cambiado aquí
import { APOD } from '../../models/apod';

@Component({
  selector: 'app-apod-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apod-detail.html',
  styleUrls: ['./apod-detail.css']
})
export class ApodDetailComponent implements OnInit {
  apod!: APOD;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nasaApiService: NasaApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadAPOD();
  }

  loadAPOD(): void {
    this.loading = true;
    const date = this.route.snapshot.paramMap.get('date');
    
    if (date) {
      this.nasaApiService.getAPOD(date).subscribe({
        next: (apod) => {
          this.apod = apod;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar la imagen. Por favor, intenta nuevamente.';
          this.loading = false;
          console.error('Error:', error);
        }
      });
    } else {
      this.error = 'Fecha no válida';
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  isVideo(): boolean {
    return this.apod?.media_type === 'video';
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}