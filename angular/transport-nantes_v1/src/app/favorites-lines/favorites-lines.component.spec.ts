import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesLinesComponent } from './favorites-lines.component';

describe('FavoritesLinesComponent', () => {
  let component: FavoritesLinesComponent;
  let fixture: ComponentFixture<FavoritesLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritesLinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
