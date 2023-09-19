import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { EvahubSidenavMenuItem } from "../common/constants";
import { tap } from "rxjs";
import {
    DeleteDocumentConfirmationDialogComponent,
    DeleteDocumentConfirmationDialogData
} from "../dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { ApplicationStateStoreService } from "../store/application-state-store";

declare function braintreeGetToken(a): void;

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy, OnDestroy {
    @Input()
    shouldDisplaySpinner: boolean;

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

    deleteDialog: DialogRef;
    deleteSubscription: any;

    constructor(private dialog: Dialog, private store: ApplicationStateStoreService) {
        //
    }

    ngOnInit(): void {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
    }

    deleteClicked($event, iid: number) {
        this.openDocumentDeleteConfirmationDialog(iid);
    }

    requestReportClicked($event, iid: number) {
        console.log("in requestReportClicked");
        braintreeGetToken(iid);
    }

    openDocumentDeleteConfirmationDialog(did) {
        this.deleteDialog = this.dialog.open(DeleteDocumentConfirmationDialogComponent, {
            minWidth: "300px",
            data: {
                documentId: did
            }
        });

        this.deleteSubscription = this.deleteDialog.closed
            .pipe(
                tap(x => {
                    console.log("x is:");
                    console.log(x);

                    if (x == "yes") {
                        this.emitDeleteItemClicked.emit({ source: event, itemId: did });
                    }
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.deleteSubscription.unsubscribe();
    }
}
