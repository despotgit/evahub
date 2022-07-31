import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubDocument,
    EvahubDocumentType,
    EvahubDocumentTypeDictionary,
    EvahubSidenavMenuOption,
    Report
} from "../services/application-state-store.service";
import { tap } from "rxjs";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
    userReports$: Observable<Report[]> = this.store.userReports$;
    selectedUserReport$: Observable<Report> = this.store.selectedUserReport$.pipe(
        tap(a => {
            console.log("in tap in Reports, a is:", a);
        })
    );
    selectedDocument$: Observable<any> = this.store.selectedDocument$;

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        console.log("in ngOnInit of reports");
        this.initUserDocsList();

        this.store.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);
    }

    userReportSelected(reportId: number) {
        console.log("doing something with", reportId);
    }

    initUserDocsList() {
        for (let docType in ["log", "report", "check"]) {
            let username = "test2";

            let url = `${environment.baseApiBackendUrl}/rest/${docType}s/get/${username}`;

            this.httpClient
                .get(url)
                .pipe(
                    map(ud => {
                        let u: any = ud;

                        //const a = EvahubDocumentType[]

                        this.store.updateUserDocuments(u["user" + docType], u.userReports);
                        this.processDocuments(u.userReports, docType);

                        return ud;
                    })
                )
                .subscribe();
        }
    }

    initUserLogsList() {}

    processDocuments(ds: EvahubDocument[], dt: EvahubDocumentType) {
        console.log("docs are: ", ds);

        const menuOptions = ds.map(r => {
            let mo: EvahubSidenavMenuOption = {
                id: r.getDocumentId(),
                label: r.getDocumentName()
            };
            return mo;
        });

        this.store.updateSidenavMenuOptions(menuOptions);

        this.store.updateSelectedUserDocument(dt, ds[0]);
    }
}
