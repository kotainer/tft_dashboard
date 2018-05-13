import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressExplorerComponent } from './address-explorer.component';

describe('AddressExplorerComponent', () => {
  let component: AddressExplorerComponent;
  let fixture: ComponentFixture<AddressExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
