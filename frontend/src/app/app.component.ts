import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HomePageDataStoreService } from "./services/home-page-data-store.service";
import { Report, UserReportsStoreService } from "./services/user-reports.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    userReports$: Observable<Report[]> = this.userReportsStore.userReports$;

    showFiller = false;

    @ViewChild("sidenav") sidenav;

    events: string[] = [];
    opened: boolean;

    title = "EVAHUB";

    constructor(
        private httpClient: HttpClient,
        private userReportsStore: UserReportsStoreService,
        private router: Router,
        private homePageDataStore: HomePageDataStoreService
    ) {
        this.userReportsStore.setState({
            userReports: []
        });

        this.homePageDataStore.setState({
            firstLastName: "",
            address: ""
        });
    }

    ngOnInit(): void {
        this.getUserReportsList();
    }

    gotoReports() {
        this.router.navigate(["/reports"]);
    }

    gotoHome() {
        this.router.navigate(["/home"]);
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
