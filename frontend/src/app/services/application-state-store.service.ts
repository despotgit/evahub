import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";
import { PageIndex } from "../common/constants";

export interface ApplicationState {
    currentUser: UserState;
    homepageData: HomePageDataState;
    userLogs: UserLogsState;
    userReports: UserReportsState;
    userChecks: UserChecksState;
    sidenav: SidenavState;
}

// USER

export interface UserState {
    username: string;
    isLoggedIn: boolean;
    currentPageIndex: PageIndex;
}

export const INITIAL_USER_STATE = {
    username: "",
    isLoggedIn: false,
    currentPageIndex: PageIndex.NONE_PAGE
};

// HOMEPAGE

export interface HomePageDataState {
    firstLastName: string;
    address: string;
}

export const INITIAL_HOMEPAGE_STATE = {
    firstLastName: "",
    address: ""
};

// SIDENAV

export interface SidenavState {
    isSidenavOpened: boolean;
    sidenavMenuOptions: EvahubSidenavMenuOption[];
}

export const INITIAL_SIDENAV_STATE = {
    isSidenavOpened: false,
    sidenavMenuOptions: []
};

export interface EvahubSidenavMenuOption {
    id: number;
    label?: string;
    action?: string;
}

// REPORTS:
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

// CHECKS:
export interface Check {
    checkUserId?: number;
    checkId?: number;
    checkContent?: string;
}

export interface UserChecksState {
    userChecks: Check[];
    selectedUserCheck: Check;
}

export const INITIAL_USER_CHECKS_STATE = {
    userChecks: [],
    selectedUserCheck: {
        checkUserId: 0,
        checkId: 0,
        checkContent: ""
    }
};

// LOGS:
export interface Log {
    logUserId?: number;
    logId?: number;
    logName?: string;
    logContent?: string;
}

export interface UserLogsState {
    userLogs: Log[];
    selectedUserLog: Log;
}

export const INITIAL_USER_LOGS_STATE = {
    userLogs: [],
    selectedUserLog: {
        logUserId: 0,
        logId: 0,
        logContent: ""
    }
};

// APP STATE:

export const INITIAL_APPLICATION_STATE = {
    currentUser: INITIAL_USER_STATE,
    homepageData: INITIAL_HOMEPAGE_STATE,
    userLogs: INITIAL_USER_LOGS_STATE,
    userReports: INITIAL_USER_REPORTS_STATE,
    userChecks: INITIAL_USER_CHECKS_STATE,
    sidenav: INITIAL_SIDENAV_STATE
};

@Injectable({
    providedIn: "root"
})
export class ApplicationStateStoreService extends ComponentStore<ApplicationState> {
    // CURRENT USER
    username$: Observable<string> = this.select(state => state.currentUser.username);
    isloggedIn$: Observable<boolean> = this.select(state => state.currentUser.isLoggedIn);
    currentPageIndex$: Observable<number> = this.select(state => state.currentUser.currentPageIndex);

    // HOMEPAGE
    firstLastName$: Observable<string> = this.select(state => state.homepageData.firstLastName);
    address$: Observable<string> = this.select(state => state.homepageData.address);

    // SIDENAV
    isSidenavOpened$: Observable<boolean> = this.select(state => state.sidenav.isSidenavOpened);
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.select(
        state => state.sidenav.sidenavMenuOptions
    );

    // REPORTS
    userReports$: Observable<Report[]> = this.select(state => state.userReports.userReports);
    selectedUserReport$: Observable<Report> = this.select(state => state.userReports.selectedUserReport);

    // LOGS
    userLogs$: Observable<Log[]> = this.select(state => state.userLogs.userLogs);
    selectedUserLog$: Observable<Log> = this.select(state => state.userLogs.selectedUserLog);

    // CHECKS
    userChecks$: Observable<Check[]> = this.select(state => state.userChecks.userChecks);
    selectedUserCheck$: Observable<Check> = this.select(state => state.userChecks.selectedUserCheck);

    constructor() {
        super();
    }

    // UPDATERS:

    // Generic update (to test)
    updateState(sliceName, propertyName, newValue) {
        const oldStateSlice = this.get(state => state[sliceName]);
        const newStateSlice = { ...oldStateSlice };
        newStateSlice[propertyName] = newValue;
        const toApply = {};
        toApply[sliceName] = newStateSlice;
        this.patchState(toApply);
    }

    // CURRENT USER:

    updateUsername(username: string) {
        this.updateState("currentUser", "username", username);
    }

    updateIsLoggedIn(isLoggedIn: boolean) {
        this.updateState("currentUser", "isLoggedIn", isLoggedIn);
    }

    updateCurrentPageIndex(currentPageIndex: number) {
        this.updateState("currentUser", "currentPageIndex", currentPageIndex);
    }

    // HOMEPAGE:

    updateFirstLastName(firstLastName: string) {
        this.updateState("homepageData", "firstLastName", firstLastName);
    }

    updateAddress(address: string) {
        this.updateState("homepageData", "address", address);
    }

    // SIDENAV:

    updateIsSidenavOpened(isSidenavOpened: boolean) {
        this.updateState("sidenav", "isSidenavOpened", isSidenavOpened);
    }

    updateSidenavMenuOptions(sidenavMenuOptions: EvahubSidenavMenuOption[]) {
        this.updateState("sidenav", "sidenavMenuOptions", sidenavMenuOptions);
    }

    // REPORTS:

    updateUserReports(ur: Report[]) {
        this.updateState("userReports", "userReports", ur);
    }

    updateSelectedUserReport(sur: Report) {
        this.updateState("userReports", "selecteduserReport", sur);
    }

    // APPLICATION STATE:

    resetApplicationState() {
        this.setState(INITIAL_APPLICATION_STATE);
    }
}
