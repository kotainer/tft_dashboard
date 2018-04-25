import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPriceChartComponent } from './unit-price-chart.component';

describe('UnitPriceChartComponent', () => {
  let component: UnitPriceChartComponent;
  let fixture: ComponentFixture<UnitPriceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitPriceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitPriceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
