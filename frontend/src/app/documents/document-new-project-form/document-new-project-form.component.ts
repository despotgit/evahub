import { Component } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";

@Component({
    selector: "evahub-document-new-project-form",
    templateUrl: "./document-new-project-form.component.html",
    styleUrls: ["./document-new-project-form.component.scss"]
})
export class DocumentNewProjectFormComponent {
    theForm: UntypedFormGroup;

    constructor() {}
}
