import { HttpClient, HttpEventType } from "@angular/common/http";
import { ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { Subscription, switchMap, map, Subject, Observable } from "rxjs";
import { combineLatestWith, finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApplicationStateStoreService } from "../store/application-state-store";

@Component({
    selector: "evahub-user-file-upload",
    templateUrl: "user-file-upload.component.html",
    styleUrls: ["user-file-upload.component.scss"]
})
export class UserFileUploadComponent implements OnDestroy {
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
        private cd: ChangeDetectorRef
    ) {
        this.store.updateSidenavMenuItems([]);
        this.store.updateIsSidenavOpened(false);
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            this.uploadObs$ = this.username$.pipe(
                switchMap(username => {
                    let url = `${environment.baseApiBackendUrl}/rest/put/document/documentType/log/username/${username}`;

                    return this.http.put(url, formData, {
                        reportProgress: true,
                        observe: "events"
                    });
                }),
                finalize(() => {
                    console.log("step 3, in finalize");
                    this.resetUpload();
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
