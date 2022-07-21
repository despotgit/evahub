import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { ReportsComponent } from "../reports/reports.component";

export interface Report {
    reportUserId?: number;
    reportId?: number;
    reportName?: string;
    reportContent?: string;
}

export interface UserReportsState {
    userReports: Report[];
    selectedUserReport: Report;
}

export const INITIAL_USER_REPORTS_STATE = {
    userReports: [],
    selectedUserReport: {
        reportUserId: 0,
        reportId: 0,
        reportName: "",
        reportContent: ""
    }
};

@Injectable({
    providedIn: "root"
})
export class UserReportsStoreService extends ComponentStore<UserReportsState> {
    constructor() {
        super();
    }

    userReports$: Observable<Report[]> = this.select(state => state.userReports);
    selectedUserReport$: Observable<Report> = this.select(state => state.selectedUserReport);

    updateUserReportsList(userReports: Report[]) {
        this.patchState({ userReports });
    }

    resetUserReportsState() {
        this.setState(INITIAL_USER_REPORTS_STATE);
    }
}
