import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
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
    uploadProgress: number;
    uploadSub$: Subscription;
    httpCall$: Subscription;

    username$ = this.store.username$;

    constructor(private http: HttpClient, private store: ApplicationStateStoreService) {
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
                        console.log("res is:", res);

                        return res;
                    }),
                    finalize(() => {
                        console.log("in finalize");
                        this.reset();
                    })
                )
                .subscribe(event => {
                    if (event.type == HttpEventType.UploadProgress) {
                        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                    }
                });

            /*
            const upload$ = this.http
                .post(url, formData, {
                    reportProgress: true,
                    observe: "events"
                })
                .pipe();

            this.uploadSub$ = upload$.subscribe(event => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                }
            });
            */
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
