import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";

export interface ApplicationState {
    currentUser: UserState;
    homepageData: HomePageDataState;
    userReports: UserReportsState;
    sidenav: SidenavState;
}

// USER

export interface UserState {
    username: string;
    isLoggedIn: boolean;
}

export const INITIAL_USER_STATE = {
    username: "",
    isLoggedIn: false
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
    userReports: INITIAL_USER_REPORTS_STATE,
    sidenav: INITIAL_SIDENAV_STATE
};

@Injectable({
    providedIn: "root"
})
export class ApplicationStateStoreService extends ComponentStore<ApplicationState> {
    // CURRENT USER
    username$: Observable<string> = this.select(state => state.currentUser.username);
    isloggedIn$: Observable<boolean> = this.select(state => state.currentUser.isLoggedIn);

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

    constructor() {
        super();
    }

    // CURRENT USER:

    updateUsername(username: string) {
        const oldCurrentUser = this.get(state => state.currentUser);
        const currentUser = {
            ...oldCurrentUser,
            username: username
        };
        this.patchState({ currentUser });
    }

    updateIsLoggedIn(isLoggedIn: boolean) {
        const oldCurrentUser = this.get(state => state.currentUser);
        const currentUser = {
            ...oldCurrentUser,
            isLoggedIn
        };
        this.patchState({ currentUser });
    }

    // HOMEPAGE:

    updateFirstLastName(firstLastName: string) {
        const oldHomepageData = this.get(state => state.homepageData);
        const homepageData = {
            ...oldHomepageData,
            firstLastName
        };
        this.patchState({ homepageData });
    }

    updateAddress(address: string) {
        const oldHomepageData = this.get(state => state.homepageData);
        const homepageData = {
            ...oldHomepageData,
            address
        };
        this.patchState({ homepageData });
    }

    // SIDENAV:

    updateIsSidenavOpened(isSidenavOpened: boolean) {
        const oldSidenav = this.get(state => state.sidenav);
        const sidenav = {
            ...oldSidenav,
            isSidenavOpened
        };
        this.patchState({ sidenav });
    }

    // REPORTS:

    updateUserReports(newUserReports: Report[]) {
        const oldReports = this.get(state => state.userReports);
        const userReports = {
            ...oldReports,
            userReports: newUserReports
        };
        this.patchState({ userReports });
    }

    updateSelectedUserReport(isLoggedIn: boolean) {
        const oldCurrentUser = this.get(state => state.currentUser);
        const currentUser = {
            ...oldCurrentUser,
            isLoggedIn
        };
        this.patchState({ currentUser });
    }

    // APPLICATION STATE:

    resetApplicationState() {
        this.setState({
            currentUser: INITIAL_USER_STATE,
            homepageData: INITIAL_HOMEPAGE_STATE,
            userReports: INITIAL_USER_REPORTS_STATE,
            sidenav: INITIAL_SIDENAV_STATE
        });
    }
}
