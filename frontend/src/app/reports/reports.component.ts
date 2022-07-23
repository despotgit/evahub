import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ApplicationStateStoreService, Report } from "../services/application-state-store.service";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
    userReports$: Observable<Report[]> = this.store.userReports$;
    selectedUserReport$: Observable<Report> = this.store.selectedUserReport$;

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {}

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
                    console.log(ur);

                    this.store.updateUserReports(u.userReports);

                    return ur;
                })
            )
            .subscribe();
    }
}
