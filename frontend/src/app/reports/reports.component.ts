import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption,
    Report
} from "../services/application-state-store.service";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
    userReports$: Observable<Report[]> = this.store.userReports$;
    selectedUserReport$: Observable<Report> = this.store.selectedUserReport$;

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        this.initUserReportsList();
    }

    userReportSelected(reportId: number) {
        console.log("doing something with", reportId);
    }

    initUserReportsList() {
        let username = "test2";

        let url = `${environment.baseApiBackendUrl}/rest/reports/get/${username}`;
        console.log("CHECKPOINT 1");

        this.httpClient
            .get(url)
            .pipe(
                map(ur => {
                    let u: any = ur;

                    this.store.updateUserReports(u.userReports);
                    this.processReports(u.userReports);

                    return ur;
                })
            )
            .subscribe();
    }

    processReports(rs: Report[]) {
        console.log("reports are: ", rs);

        const menuOptions = rs.map(r => {
            let mo: EvahubSidenavMenuOption = {
                id: r.reportId,
                label: r.reportName
            };
            return mo;

            //
        });

        console.log("menuOptions is:", menuOptions);

        this.store.updateSidenavMenuOptions(menuOptions);
        //this.store.updateSelectedUserReport()
    }
}
