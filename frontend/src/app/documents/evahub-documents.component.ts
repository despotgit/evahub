import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
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
        console.log("in ngOnInit of documents");
        this.initUserDocsList();

        this.store.updateCurrentPageIndex(PageIndex.REPORTS_PAGE);
    }

    userReportSelected(reportId: number) {
        console.log("doing something with", reportId);
    }

    initUserDocsList() {
        const docTypes = ["Log", "Report", "Check"];

        for (let i = 0; i < docTypes.length; i++) {
            let docType = docTypes[i];
            let docTypeToLower = docType.toLowerCase();
            console.log("docType is:", docType);
            let username = "test2";

            let url = `${environment.baseApiBackendUrl}/rest/${docTypeToLower}s/get/${username}`;

            this.httpClient
                .get(url)
                .pipe(
                    map(ud => {
                        console.log("ud is:", ud);

                        let ds = ud["user" + docType + "s"];

                        console.log("ds is:", ds);

                        this.store.updateUserDocuments(docType, ds);
                        this.processDocuments(ds, EvahubDocumentTypeDictionary[docTypeToLower]);

                        return ud;
                    })
                )
                .subscribe();
        }
    }

    initUserLogsList() {}

    //processDocuments(ds: EvahubDocument[], dt: EvahubDocumentType) {
    processDocuments(ds: any[], dt: EvahubDocumentType) {
        console.log("docs are: ", ds);
        console.log("dt is: ", dt);

        const menuOptions = ds.map(d => {
            console.log("d is:", d);

            let doc;
            switch (dt) {
                case EvahubDocumentType.EVAHUB_LOG:
                    doc = new Log();

                    console.log("keys are:");
                    console.log(Object.keys(d));

                    console.log("is a log");
                    break;
                case EvahubDocumentType.EVAHUB_REPORT:
                    doc = new Report();
                    console.log("is a report");
                    break;
                case EvahubDocumentType.EVAHUB_CHECK:
                    doc = new Check();
                    console.log("is a check");
                    break;
            }

            Object.keys(d).forEach(p => {
                //
                doc[p] = d[p];
            });

            doc.documentType = dt;

            //console.log();
            let mo: EvahubSidenavMenuOption = {
                id: doc.getDocumentId(),
                label: doc.getDocumentName()
            };
            return mo;
        });

        this.store.updateSidenavMenuOptions(menuOptions);

        this.store.updateSelectedUserDocument(dt, ds[0]);
    }
}
