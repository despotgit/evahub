import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvahubGraphControlsComponent } from './evahub-graph-controls.component';

describe('EvahubGraphControlsComponent', () => {
  let component: EvahubGraphControlsComponent;
  let fixture: ComponentFixture<EvahubGraphControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvahubGraphControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvahubGraphControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
