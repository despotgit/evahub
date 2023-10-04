import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Log } from "src/app/models/Log";
import { Project } from "src/app/models/Project";
import { RestApiClient } from "src/app/services/rest-api-client.service";
import { Observable, combineLatest, debounceTime, distinctUntilChanged, map, tap } from "rxjs";
import { ApplicationStateStoreService } from "src/app/store/application-state-store";
import { EvahubDocumentType } from "src/app/common/constants";

export class LogSelection {
    log: Log;
    selected: boolean;
}

@Component({
    selector: "evahub-document-new-project-form",
    templateUrl: "./document-new-project-form.component.html",
    styleUrls: ["./document-new-project-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentNewProjectFormComponent implements OnInit {
    submitClicked$: Observable<any>;
    projectName$: Observable<string> = this.store.newProjectName$.pipe(
        tap(newProjectName => {
            this.theForm.get("projectName").setValue(newProjectName);
        })
    );
    projectDescription$: Observable<string> = this.store.newProjectDescription$.pipe(
        tap(projectDescription => {
            this.theForm.get("projectDescription").setValue(projectDescription);
        })
    );

    @Input()
    username: string;

    @Input()
    newProjectName: string;

    @Input()
    newProjectDescription: string;

    @Input()
    logs: Log[];

    theForm: UntypedFormGroup;
    result: any;
    submitted = false;
    error = "";
    loading = false;
    formData: any = {};
    logSelections: LogSelection[] = [];
    displaySuccessMessage: boolean;

    constructor(
        private fb: UntypedFormBuilder,
        private rest: RestApiClient,
        private store: ApplicationStateStoreService,
        private cd: ChangeDetectorRef
    ) {
        //
        this.theForm = this.fb.group({
            projectName: ["", [Validators.required]],
            projectDescription: ["", []]
        });
    }

    ngOnInit() {
        const projectNameChanges$: Observable<any> = this.theForm.get("projectName").valueChanges;
        const projectDescriptionChanges$: Observable<any> = this.theForm.get("projectDescription").valueChanges;

        combineLatest([projectNameChanges$, projectDescriptionChanges$])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(([projectNameChanges, projectDescriptionChanges]) => {
                    this.store.updateNewProjectName(projectNameChanges);
                    this.store.updateNewProjectDescription(projectDescriptionChanges);

                    this.formData.projectName = projectNameChanges;
                    this.formData.projectDescription = projectDescriptionChanges;

                    //console.log("regData is:", this.registrationData);
                })
            )
            .subscribe();

        this.initLogs();
        this.displaySuccessMessage = false;
    }

    initLogs() {
        this.logSelections = [];

        this.logs.forEach(l => {
            let ls: LogSelection = new LogSelection();
            ls.log = l;
            ls.selected = false;
            this.logSelections.push(ls);
        });
    }

    get f() {
        return this.theForm.controls;
    }

    // On submitting the username and password
    onSubmit() {
        console.log("in onSubmit");
        this.submitted = true;
        this.loading = true;

        this.formData.projectLogs = this.getSelectedLogs().join(",");

        this.rest.createNewProject(this.formData, this.username).subscribe((r: any) => {
            console.log("r is:", r);
            if (r.status == "ok") {
                this.loading = false;
                this.displaySuccessMessage = true;
                this.cd.markForCheck();
                this.store.updateDocumentsSetFromApi$.next(EvahubDocumentType.project);
            }
        });
    }

    getSelectedLogs() {
        return this.logSelections
            .filter(ls => ls.selected)
            .map(f => {
                return f.log.logId;
            });
    }

    onChipsSelectionChange(logId) {
        console.log("logId is:", logId);
        console.log("logSelections are", this.logSelections);
    }
}
