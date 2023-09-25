import { HttpEventType } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Observable, Subscription } from "rxjs";

@Component({
    selector: "app-document-upload-form",
    templateUrl: "./document-upload-form.component.html",
    styleUrls: ["./document-upload-form.component.scss"]
})
export class DocumentUploadFormComponent {
    @Input()
    requiredFileType: string = "png";

    @Output()
    emitFileSelected: EventEmitter<any> = new EventEmitter();

    @Output()
    emitUploadInitiated: EventEmitter<any> = new EventEmitter();

    @Input()
    uploadProgress: number;

    @Output()
    emitResetUpload: EventEmitter<any> = new EventEmitter();

    fileName = "";

    constructor() {}

    onFileSelected(event) {
        //const file: File = event.target.files[0];
        this.emitFileSelected.emit(event);
    }

    onUploadInitiated() {
        this.emitUploadInitiated.emit();
    }
}
