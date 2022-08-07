import { HttpClient, HttpEventType } from "@angular/common/http";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
    selector: "evahub-user-file-upload",
    templateUrl: "user-file-upload.component.html",
    styleUrls: ["user-file-upload.component.scss"]
})
export class UserFileUploadComponent {
    @ViewChild("fileUpload")
    fileUpload: ElementRef;

    @Input()
    requiredFileType: string;

    fileName = "";
    uploadProgress: number;
    uploadSub: Subscription;

    constructor(private http: HttpClient) {}

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("thumbnail", file);

            const upload$ = this.http
                .post("/api/thumbnail-upload", formData, {
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

    upload() {
        this.fileUpload.value = "";
        this.fileUpload.click();
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
