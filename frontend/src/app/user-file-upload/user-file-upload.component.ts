import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";

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
    uploadSub: Subscription;

    constructor(private http: HttpClient) {}

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            let url = `${environment.baseApiBackendUrl}/upload/user_log_upload`;

            const upload$ = this.http

                .post(url, formData, {
                    reportProgress: true,
                    observe: "events"
                })
                .pipe(
                    finalize(() => {
                        console.log("in finalize");
                        this.reset();
                    })
                );

            this.uploadSub = upload$.subscribe(event => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                }
            });
        }
    }

    cancelUpload() {
        this.uploadSub.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = null;
        this.uploadSub = null;
    }
}
