import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Report, UserReportsStoreService } from "../services/user-reports.service";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
    userReports$: Observable<Report[]> = this.userReportsStore.userReports$;

    showFiller = false;

    @ViewChild("drawer") drawer;

    events: string[] = [];
    opened: boolean;

    constructor(private httpClient: HttpClient, private userReportsStore: UserReportsStoreService) {
        this.userReportsStore.setState({
            userReports: []
        });
    }

    ngOnInit(): void {
        this.getUserReportsList();
    }

    getUserReportsList() {
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

    userReportSelected(reportId: number) {
        console.log("doing something with", reportId);
    }
}
