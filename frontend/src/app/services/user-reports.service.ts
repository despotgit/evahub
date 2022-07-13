import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";

export interface Report {
    reportUserId: number;
    reportId: number;
    reportName: string;
    reportContent: string;
}

export interface UserReportsState {
    userReports: Report[];
}

@Injectable({
    providedIn: "root"
})
export class UserReportsStoreService extends ComponentStore<UserReportsState> {
    constructor() {
        super();
    }

    $userReports: Observable<Report[]> = this.select(state => state.userReports);

    updateUserReportsList(userReports: Report[]) {
        this.patchState({ userReports });
    }
}
