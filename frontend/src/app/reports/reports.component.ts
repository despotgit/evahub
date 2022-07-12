import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        //
        this.getReportsList();
    }

    getReportsList() {}
}
