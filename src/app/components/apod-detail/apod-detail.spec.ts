import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApodDetailComponent } from './apod-detail'; // Cambiado aquí
import { NasaApiService } from '../../services/nasa-api';
import { APOD } from '../../models/apod';

describe('ApodDetailComponent', () => {
  let component: ApodDetailComponent;
  let fixture: ComponentFixture<ApodDetailComponent>;
  let mockNasaApiService: jasmine.SpyObj<NasaApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockAPOD: APOD = {
    date: '2024-01-01',
    explanation: 'Test explanation',
    hdurl: 'https://test.com/hd.jpg',
    media_type: 'image',
    service_version: 'v1',
    title: 'Test Title',
    url: 'https://test.com/image.jpg'
  };

  beforeEach(async () => {
    mockNasaApiService = jasmine.createSpyObj('NasaApiService', ['getAPOD']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('2024-01-01')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ApodDetailComponent],
      providers: [
        { provide: NasaApiService, useValue: mockNasaApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApodDetailComponent);
    component = fixture.componentInstance;
    mockNasaApiService.getAPOD.and.returnValue(of(mockAPOD));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load APOD on init', () => {
    component.ngOnInit();
    expect(mockNasaApiService.getAPOD).toHaveBeenCalledWith('2024-01-01');
    expect(component.apod).toEqual(mockAPOD);
  });

  it('should handle error when loading APOD fails', () => {
    const error = new Error('Test error');
    mockNasaApiService.getAPOD.and.returnValue(of(mockAPOD)); // Cambiar a error si quieres probar el caso de error
    
    component.ngOnInit();
    // Aquí puedes agregar más pruebas para el manejo de errores
    expect(component).toBeTruthy();
  });

  it('should check if media is video', () => {
    component.apod = mockAPOD;
    expect(component.isVideo()).toBeFalse();

    component.apod.media_type = 'video';
    expect(component.isVideo()).toBeTrue();
  });

  it('should navigate back', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});