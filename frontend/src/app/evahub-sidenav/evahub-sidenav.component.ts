import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";

import { EvahubSidenavMenuItem } from "../common/constants";
import { tap } from "rxjs";
import {
    DeleteDocumentConfirmationDialogComponent,
    DeleteDocumentConfirmationDialogData
} from "../dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { ApplicationStateStoreService } from "../store/application-state-store";
import { HttpClient } from "@angular/common/http";

declare function braintreeGetToken(a): void;

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubSidenavComponent implements OnInit, OnDestroy, OnDestroy {
    @Input()
    shouldDisplaySpinner: boolean;

    @Input()
    isInDocumentUploadMode: boolean;

    @Input()
    isInNewProjectCreationMode: boolean;

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

    @Output()
    emitUploadNewDocumentClicked: EventEmitter<any> = new EventEmitter();

    username$ = this.store.username$;

    deleteDialog: DialogRef<any, any>;

    deleteSubscription: any;

    constructor(
        private dialog: Dialog,
        private store: ApplicationStateStoreService,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {
        //
    }

    ngOnInit(): void {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
        this.store.updateIsEmptyDocumentPage(false);
    }

    deleteClicked(iid: number) {
        this.openDocumentDeleteConfirmationDialog(iid);
    }

    requestReportClicked(iid: number) {
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
                    if (x == "yes") {
                        this.emitDeleteItemClicked.emit({ source: event, itemId: did });
                    }
                })
            )
            .subscribe();
    }

    uploadNewDocumentClicked() {
        this.emitUploadNewDocumentClicked.emit();
    }

    isInCreationMode() {
        let val = this.isInDocumentUploadMode || this.isInNewProjectCreationMode;
        return val;
    }

    ngOnDestroy(): void {}
}
