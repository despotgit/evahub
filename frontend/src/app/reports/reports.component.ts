import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { INITIAL_USER_REPORTS_STATE, Report, UserReportsStoreService } from "../services/user-reports.service";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
    constructor(private userReportsStore: UserReportsStoreService, private httpClient: HttpClient) {
        this.userReportsStore.setState(INITIAL_USER_REPORTS_STATE);
    }

    userReports$: Observable<Report[]> = this.userReportsStore.userReports$;

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

                    this.userReportsStore.updateUserReportsList(u.userReports);

                    return ur;
                })
            )
            .subscribe();
    }
}
