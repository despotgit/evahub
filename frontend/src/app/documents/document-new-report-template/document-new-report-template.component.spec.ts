import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNewReportTemplateComponent } from './document-new-report-template.component';

describe('DocumentNewReportTemplateComponent', () => {
  let component: DocumentNewReportTemplateComponent;
  let fixture: ComponentFixture<DocumentNewReportTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentNewReportTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentNewReportTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
