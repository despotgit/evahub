import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { Log } from "src/app/models/Log";
import { Project } from "src/app/models/Project";
import { AuthenticationService } from "src/app/services/authentication.service";
import { RestApiService } from "src/app/services/rest-api.service";
import { ApplicationStateStoreService } from "src/app/store/application-state-store";
import { ThemePalette } from "@angular/material/core";

export interface ChipColor {
    name: string;
    color: ThemePalette;
}

@Component({
    selector: "evahub-document-new-project-form",
    templateUrl: "./document-new-project-form.component.html",
    styleUrls: ["./document-new-project-form.component.scss"]
})
export class DocumentNewProjectFormComponent implements OnInit {
    @Input()
    username: string;

    theForm: UntypedFormGroup;
    result: any;
    availableLogs: any;

    availableColors: ChipColor[] = [
        { name: "none", color: undefined },
        { name: "Primary", color: "primary" },
        { name: "Accent", color: "accent" },
        { name: "Warn", color: "warn" }
    ];

    constructor(private rest: RestApiService, private store: ApplicationStateStoreService) {
        //
    }

    ngOnInit() {
        this.rest.getDocumentsSet("log", this.username).subscribe(r => {
            //console.log("r is:", r);
            this.result = r;
            this.processDocuments(r);
            //this.availableLogs = r && r.userDocuments ? r.userDocuments : null;
        });
    }

    processDocuments(a: any) {
        console.log("a is:", a);

        let ds = a.userDocuments;
        this.availableLogs = a.userDocuments;
    }

    displayLogs() {
        console.log("ls are:", this.availableLogs);
    }
}
