import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTextComponent } from './documents-text.component';

describe('DocumentsTextComponent', () => {
  let component: DocumentsTextComponent;
  let fixture: ComponentFixture<DocumentsTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
