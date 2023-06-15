import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGraphComponent } from './documents-graph.component';

describe('DocumentsGraphComponent', () => {
  let component: DocumentsGraphComponent;
  let fixture: ComponentFixture<DocumentsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
