import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubDocument,
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
    selectedDocument$ = this.store.selectedDocument$;

    currentPageIndex$: Observable<any> = this.store.currentPageIndex$;

    httpDocsCall: any;

    constructor(private store: ApplicationStateStoreService) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        this.store.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);
    }
}
