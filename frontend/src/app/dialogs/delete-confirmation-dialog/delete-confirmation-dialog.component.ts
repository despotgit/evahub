import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { Dialog, DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";

export interface DeleteDocumentConfirmationDialogData {
    toDeleteOrNotToDelete: string;
    documentId: number;
}

@Component({
    selector: "app-delete-confirmation-dialog",
    templateUrl: "./delete-confirmation-dialog.component.html",
    styleUrls: ["./delete-confirmation-dialog.component.scss"]
})
export class DeleteDocumentConfirmationDialogComponent {
    @Input() set d(d) {
        this.data = d;
    }

    @Output() emitAnswer: EventEmitter<string> = new EventEmitter();

    constructor(
        public dialogRef: DialogRef<string>,
        @Inject(DIALOG_DATA) public data: DeleteDocumentConfirmationDialogData
    ) {
        //
    }

    emitIt(ans = "no") {
        this.dialogRef.close(ans);
    }
}
