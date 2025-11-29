import { HttpClient, HttpEventType } from "@angular/common/http";
import { ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { Subscription, switchMap, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { ApplicationStateStoreService } from "../../store/application-state-store";
import { RestApiClient } from "src/app/services/rest-api-client.service";
import { tap } from "rxjs/operators";
import { EvahubDocumentType } from "src/app/common/constants";

@Component({
    selector: "evahub-document-upload-form-component",
    templateUrl: "document-upload-form.component.html",
    styleUrls: ["document-upload-form.component.scss"]
})
export class DocumentUploadFormComponent implements OnDestroy {
    @Input()
    requiredFileType: string = "png";

    fileName = "";
    uploadProgress: number;
    uploadObs$: Observable<any>;
    uploadSub$: Subscription;

    username$ = this.store.username$;

    constructor(
        private http: HttpClient,
        private store: ApplicationStateStoreService,
        private cd: ChangeDetectorRef,
        private rest: RestApiClient
    ) {
        //this.store.updateSidenavMenuItems([]);
        //this.store.updateIsSidenavOpened(false);
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            /*
            this.uploadObs$ = this.username$.pipe(
                switchMap(username => this.rest.putNewDocument(formData, username)),
                finalize(() => {
                    console.log("step 3, in finalize");
                    this.resetUpload();
                })
            );
            */

            this.uploadObs$ = this.username$.pipe(
                switchMap(username => this.rest.putNewDocument(formData, username)),
                tap(event => {
                    if (event.type === HttpEventType.Response) {
                        console.log("Upload complete, server responded:", event.body);
                        this.store.updateDocumentsSetFromApi$.next(EvahubDocumentType.log);


                        this.resetUpload();
                    }
                })
            );
        }
    }

    onUploadInitiated() {
        console.log();

        this.uploadSub$ = this.uploadObs$.subscribe(event => {
            if (event.type == HttpEventType.UploadProgress) {
                console.log("UPLOAD PROGRESS, event is:", event);
                const newProgress = Math.round(100 * (event.loaded / event.total));
                this.uploadProgress = newProgress;
                this.cd.markForCheck();
            }
        });
    }

    resetUpload() {
        if (this.uploadSub$) {
            this.uploadSub$.unsubscribe();
        }

        this.uploadProgress = null;
        this.uploadSub$ = null;
    }

    ngOnDestroy() {
        this.resetUpload();
    }
}
