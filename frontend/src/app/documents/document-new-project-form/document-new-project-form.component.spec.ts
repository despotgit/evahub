import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNewProjectFormComponent } from './document-new-project-form.component';

describe('DocumentNewProjectFormComponent', () => {
  let component: DocumentNewProjectFormComponent;
  let fixture: ComponentFixture<DocumentNewProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentNewProjectFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentNewProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
