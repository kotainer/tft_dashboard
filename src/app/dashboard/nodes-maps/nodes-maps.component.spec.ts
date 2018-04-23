import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesMapsComponent } from './nodes-maps.component';

describe('NodesMapsComponent', () => {
  let component: NodesMapsComponent;
  let fixture: ComponentFixture<NodesMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
