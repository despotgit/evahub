import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Log } from "src/app/models/Log";
import { Project } from "src/app/models/Project";
import { RestApiClient } from "src/app/services/rest-api-client.service";
import { ThemePalette } from "@angular/material/core";
import { Observable, combineLatest, debounceTime, distinctUntilChanged, map, tap } from "rxjs";
import { ApplicationStateStoreService } from "src/app/store/application-state-store";

export interface ChipColor {
    name: string;
    color: ThemePalette;
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
    logs: Log[];

    @Input()
    newProjectName: string;

    @Input()
    newProjectDescription: string;

    @Input()
    newProjectAvailableLogs: Log[];

    theForm: UntypedFormGroup;
    result: any;
    submitted = false;
    error = "";
    loading = false;
    formData: any = {};

    constructor(
        private cd: ChangeDetectorRef,
        private formBuilder: UntypedFormBuilder,
        private rest: RestApiClient,
        private store: ApplicationStateStoreService
    ) {
        //
        this.theForm = this.formBuilder.group({
            projectName: ["", [Validators.required]],
            projectDescription: ["", []]
        });
    }

    ngOnInit() {
        const projectName$: Observable<any> = this.theForm.get("projectName").valueChanges;
        const projectDescription$: Observable<any> = this.theForm.get("projectDescription").valueChanges;

        combineLatest([projectName$, projectDescription$])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                map(([projectName, projectDescription]) => {
                    this.store.updateNewProjectName(projectName);
                    this.store.updateNewProjectDescription(projectDescription);

                    this.formData.projectName = projectName;
                    this.formData.projectDescription = projectDescription;

                    //console.log("regData is:", this.registrationData);
                })
            )
            .subscribe();
    }

    get f() {
        return this.theForm.controls;
    }

    // On submitting the username and password
    onSubmit() {
        console.log("in onSubmit");
        this.submitted = true;

        // stop if form is invalid
        if (this.theForm.invalid) {
            console.log("form is invalid");
            return;
        }

        this.loading = true;

        this.rest.postNewProject("", null);

        /*
        this.rest. (this.f["username"].value, this.f["password"].value).subscribe(data => {
            console.log("login dat. is:", data);
            if (data.success) {
                console.log("project created with success");
            } else {
                console.log("just before wrong credentials entered");
                this.error = data.message;
                console.log("error is:", this.error);
                this.cd.markForCheck();
            }
            this.loading = false;
            return;
        });
        */
    }

    isSelected(al) {
        return false;
    }

    displayLogs() {
        console.log("ls are:", this.logs);
    }
}
