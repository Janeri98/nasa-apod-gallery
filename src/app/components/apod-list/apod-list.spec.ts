import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApodList } from './apod-list';

describe('ApodList', () => {
  let component: ApodList;
  let fixture: ComponentFixture<ApodList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApodList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApodList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
