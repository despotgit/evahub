import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { map, Observable } from "rxjs";
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
    currentDocumentId: number;
}

export const INITIAL_USER_STATE = {
    username: "",
    isLoggedIn: false,
    currentPageIndex: PageIndex.NONE_PAGE,
    currentDocumentId: 0
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

export class EvahubSidenavMenuOption {
    id: number;
    label?: string;
    action?: string;
}

// REPORTS:
export class Report implements EvahubDocument {
    reportUserId?: number;
    reportId?: number;
    reportName?: string;
    reportContent?: string;

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_REPORT;

    getDocumentId() {
        return this.reportId;
    }

    getDocumentName() {
        return this.reportName;
    }

    getDocumentContent() {
        return this.reportContent;
    }
}

export class UserReportsState {
    userReports: Report[];
    selectedUserReport: Report;
}

export const INITIAL_USER_REPORTS_STATE = {
    userReports: [],
    selectedUserReport: new Report()
};

// CHECKS:
export class Check {
    checkUserId?: number;
    checkId?: number;
    checkName?: string;
    checkContent?: string;

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_CHECK;

    getDocumentId() {
        return this.checkId;
    }

    getDocumentName() {
        return this.checkName;
    }

    getDocumentContent() {
        return this.checkContent;
    }
}

export class UserChecksState {
    userChecks: Check[];
    selectedUserCheck: Check;
}

export const INITIAL_USER_CHECKS_STATE = {
    userChecks: [],
    selectedUserCheck: new Check()
};

// LOGS:
export class Log implements EvahubDocument {
    logUserId?: number;
    logId?: number;
    logName?: string;
    logContent?: string;

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_LOG;

    getDocumentId() {
        return this.logId;
    }

    getDocumentName() {
        return this.logName;
    }

    getDocumentContent() {
        return this.logContent;
    }
}

export class UserLogsState {
    userLogs: Log[];
    selectedUserLog: Log;
}

export const INITIAL_USER_LOGS_STATE = {
    userLogs: [],
    selectedUserLog: new Log()
};

// General

export const EvahubDocumentTypeDictionary = {
    log: EvahubDocumentType.EVAHUB_LOG,
    report: EvahubDocumentType.EVAHUB_REPORT,
    check: EvahubDocumentType.EVAHUB_CHECK
};

export const EvahubDocumentTypeStringDictionary = {
    log: "Log",
    report: "Report",
    check: "Check"
};

export const enum EvahubDocumentType {
    EVAHUB_LOG = 1,
    EVAHUB_REPORT = 2,
    EVAHUB_CHECK = 3
}

export interface EvahubDocument {
    documentType: EvahubDocumentType;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}

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
    currentPageIndex$: Observable<number> = this.select(
        state => state.currentUser.currentPageIndex
    );
    currentDocumentId$: Observable<number> = this.select(
        state => state.currentUser.currentDocumentId
    );

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
    selectedUserReport$: Observable<Report> = this.select(
        state => state.userReports.selectedUserReport
    );

    // LOGS
    userLogs$: Observable<Log[]> = this.select(state => state.userLogs.userLogs);
    selectedUserLog$: Observable<Log> = this.select(state => state.userLogs.selectedUserLog);

    // CHECKS
    userChecks$: Observable<Check[]> = this.select(state => state.userChecks.userChecks);
    selectedUserCheck$: Observable<Check> = this.select(
        state => state.userChecks.selectedUserCheck
    );

    // General
    selectedDocument$: Observable<any> = this.select(
        this.currentPageIndex$,
        this.currentDocumentId$,
        this.userLogs$,
        this.userReports$,
        this.userChecks$,

        (cpi, docId, ls, rs, cs) => {
            switch (cpi) {
                case PageIndex.LOGS_PAGE:
                    //console.log("d logs");
                    return ls[docId];

                case PageIndex.REPORTS_PAGE:
                    //console.log("d reports");
                    return rs[docId];

                case PageIndex.CHECKS_PAGE:
                    //console.log("d checks");
                    return cs[docId];
            }

            return "nothing selected";
        }
    );

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

    updateCurrentDocumentId(id: number) {
        this.updateState("currentUser", "currentDocumentId", id);
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

    // GENERAL:

    updateUserDocuments(documentType: string, documents: EvahubDocument) {
        //
        this.updateState("user" + documentType + "s", "user" + documentType + "s", documents);
    }

    updateSelectedUserDocument(documentType: string, doc: EvahubDocument) {
        this.updateState("user" + documentType + "s", "selectedUserDocument", doc);
    }

    // APPLICATION STATE:

    resetApplicationState() {
        this.setState(INITIAL_APPLICATION_STATE);
    }
}
