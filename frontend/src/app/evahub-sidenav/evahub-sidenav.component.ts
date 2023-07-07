import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { EvahubSidenavMenuItem } from "../common/constants";
import { of } from "rxjs";
import { DeleteDocumentConfirmationDialogComponent } from "../dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { Dialog } from "@angular/cdk/dialog";

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    @Input()
    menuItems: EvahubSidenavMenuItem[];

    @Input()
    selectedDocumentId: number;

    @Output()
    emitItemClicked: EventEmitter<number> = new EventEmitter();

    @Output()
    emitDeleteItemClicked: EventEmitter<{ source: Event; itemId: number }> = new EventEmitter<{
        source;
        itemId;
    }>();

    constructor(private dialog: Dialog) {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
    }

    deleteClicked($event, iid: number) {
        //this.emitDeleteItemClicked.emit({ source: $event, itemId: iid });
        this.openDocumentDeleteConfirmationDialog(iid);
    }

    openDocumentDeleteConfirmationDialog(did) {
        this.dialog.open(DeleteDocumentConfirmationDialogComponent, {
            minWidth: "300px",
            data: {
                documentId: did
            }
        });
    }

    deleteConfirmed($event, iid: number) {
        //this.emitDeleteItemClicked.emit({ source: $event, itemId: iid });
    }
}
