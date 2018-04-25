import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPriceChartComponent } from './token-price-chart.component';

describe('TokenPriceChartComponent', () => {
  let component: TokenPriceChartComponent;
  let fixture: ComponentFixture<TokenPriceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenPriceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenPriceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
