import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetHistoComponent } from './net-histo.component';

describe('NetHistoComponent', () => {
  let component: NetHistoComponent;
  let fixture: ComponentFixture<NetHistoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetHistoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetHistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
