import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LstlieuxComponent } from './lstlieux.component';

describe('LstlieuxComponent', () => {
  let component: LstlieuxComponent;
  let fixture: ComponentFixture<LstlieuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LstlieuxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LstlieuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
