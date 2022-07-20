import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvahubSidenavComponent } from './evahub-sidenav.component';

describe('EvahubSidenavComponent', () => {
  let component: EvahubSidenavComponent;
  let fixture: ComponentFixture<EvahubSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvahubSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvahubSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
