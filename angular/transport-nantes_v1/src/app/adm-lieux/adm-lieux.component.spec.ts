import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmLieuxComponent } from './adm-lieux.component';

describe('AdmLieuxComponent', () => {
  let component: AdmLieuxComponent;
  let fixture: ComponentFixture<AdmLieuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmLieuxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmLieuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
