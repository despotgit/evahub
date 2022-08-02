import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BehaviorSubject, map, Observable, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    Check,
    EvahubDocument,
    EvahubDocumentType,
    EvahubDocumentTypeDictionary,
    EvahubSidenavMenuOption,
    Log,
    Report
} from "../services/application-state-store.service";
import { tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit {
    userReports$: Observable<Report[]> = this.store.userReports$;
    selectedUserReport$: Observable<Report> = this.store.selectedUserReport$.pipe(
        tap(a => {
            console.log("in tap in documents, selected user report is:", a);
        })
    );
    selectedDocument$: Observable<EvahubDocument> = this.store.selectedDocument$.pipe(
        map(a => {
            console.log("in selectedDocument$ in documents component, a is:", a);
            console.log("getContent is:", a.getDocumentContent());
            return a;
        })
    );

    currentPageIndex$: Observable<any> = this.store.currentPageIndex$;

    httpDocsCall: any;

    constructor(
        private store: ApplicationStateStoreService,
        private httpClient: HttpClient,
        private route: ActivatedRoute
    ) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        console.log("in ngOnInit of documents");
        //this.initUserDocsList();

        this.store.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);

        //console.log("snapshot is:", this.route.snapshot);
    }

    userReportSelected(reportId: number) {
        console.log("doing something with", reportId);
    }
}
