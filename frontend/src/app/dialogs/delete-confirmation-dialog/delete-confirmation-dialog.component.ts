import { Component, Inject, Input } from "@angular/core";
import { Dialog, DIALOG_DATA, DialogModule } from "@angular/cdk/dialog";

export interface DeleteDocumentConfirmationDialogData {
    documentId: number;
}

@Component({
    selector: "app-delete-confirmation-dialog",
    templateUrl: "./delete-confirmation-dialog.component.html",
    styleUrls: ["./delete-confirmation-dialog.component.scss"]
})
export class DeleteDocumentConfirmationDialogComponent {
    @Input() set d(d) {
        //d: DeleteDocumentConfirmationDialogComponent {
        this.data = d;
    }

    constructor(@Inject(DIALOG_DATA) public data: DeleteDocumentConfirmationDialogData) {
        //
    }
}
