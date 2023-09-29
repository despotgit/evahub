import { Component, Input } from "@angular/core";
import { Log } from "src/app/models/Log";

import { Project } from "src/app/models/Project";

@Component({
    selector: "app-documents-project",
    templateUrl: "./documents-project.component.html",
    styleUrls: ["./documents-project.component.scss"]
})
export class DocumentsProjectComponent {
    @Input()
    projectDescription: string;

    @Input()
    projectName: string;

    @Input()
    projectLogs;

    @Input()
    d: Project;

    constructor() {}
}
