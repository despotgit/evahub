import { Component, Input } from "@angular/core";

@Component({
    selector: "app-document-new-report-template",
    templateUrl: "./document-new-report-template.component.html",
    styleUrls: ["./document-new-report-template.component.scss"]
})
export class DocumentNewReportTemplateComponent {
    @Input()
    derivedSig;
}
