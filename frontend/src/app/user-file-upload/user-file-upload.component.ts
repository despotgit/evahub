import { HttpClient, HttpEventType } from "@angular/common/http";
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { Subscription, switchMap, map } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApplicationStateStoreService } from "../services/application-state-store.service";

@Component({
    selector: "evahub-user-file-upload",
    templateUrl: "user-file-upload.component.html",
    styleUrls: ["user-file-upload.component.scss"]
})
export class UserFileUploadComponent {
    @Input()
    requiredFileType: string = "png";

    fileName = "";
    uploadProgress: number = 50;
    uploadSub$: Subscription;
    httpCall$: Subscription;

    username$ = this.store.username$;

    constructor(
        private http: HttpClient,
        private store: ApplicationStateStoreService,
        private cd: ChangeDetectorRef
    ) {
        this.store.updateSidenavMenuOptions([]);
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            let url;

            this.httpCall$ = this.username$
                .pipe(
                    switchMap(username => {
                        url = `${environment.baseApiBackendUrl}/upload/user-log-upload/${username}`;

                        return this.http.post(url, formData, {
                            reportProgress: true,
                            observe: "events"
                        });
                    }),
                    map(res => {
                        console.log("step 2, res is:", res);

                        return res;
                    }),
                    finalize(() => {
                        console.log("step 3, in finalize");
                        this.reset();
                    })
                )
                .subscribe(event => {
                    if (event.type == HttpEventType.UploadProgress) {
                        console.log("UPLOAD PROGRESS, event is:", event);
                        const newProgress = Math.round(100 * (event.loaded / event.total));
                        this.uploadProgress = newProgress;
                        this.cd.markForCheck();
                    }
                });
        }
    }

    cancelUpload() {
        this.httpCall$.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = null;
        this.httpCall$ = null;
    }
}
