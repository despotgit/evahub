import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap, map, Observable } from "rxjs";
import { EvahubMainMenuItem, getInitialMainMenuItems, PageIndex } from "../common/constants";
import { Check } from "../models/Check";
import { EvahubDocument, EvahubDocumentType } from "../models/EvahubDocument";
export { EvahubDocument, EvahubDocumentType } from "../models/EvahubDocument";
import { Log } from "../models/Log";
import { Report } from "../models/Report";
export { Report } from "../models/Report";

export interface ApplicationState {
    currentUser: UserState;
    registerPageData: RegisterPageDataState;
    userLogs: UserLogsState;
    userReports: UserReportsState;
    userChecks: UserChecksState;
    sidenav: SidenavState;
    mainMenu: MainMenuState;
}

// REGISTER

export interface RegisterPageDataState {
    registerUsername: string;
    registerPassword: string;
    firstLastName: string;
    email: string;
}

export const INITIAL_REGISTER_PAGE_STATE = {
    registerUsername: "",
    registerPassword: "",
    firstLastName: "",
    email: ""
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
    selected: boolean;
}

export class UserReportsState {
    userReports: Report[];
    selectedUserReport: Report;
}

export const INITIAL_USER_REPORTS_STATE = {
    userReports: [],
    selectedUserReport: new Report()
};

export class UserChecksState {
    userChecks: Check[];
    selectedUserCheck: Check;
}

export const INITIAL_USER_CHECKS_STATE = {
    userChecks: [],
    selectedUserCheck: new Check()
};

export class UserLogsState {
    userLogs: Log[];
    selectedUserLog: Log;
}

export const INITIAL_USER_LOGS_STATE = {
    userLogs: [],
    selectedUserLog: new Log()
};

// MAIN MENU
export class MainMenuState {
    mainMenuItems: EvahubMainMenuItem[];
}

export const INITIAL_MAIN_MENU = {
    mainMenuItems: getInitialMainMenuItems()
};

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

// APP STATE:

export const INITIAL_APPLICATION_STATE = {
    currentUser: INITIAL_USER_STATE,
    registerPageData: INITIAL_REGISTER_PAGE_STATE,
    userLogs: INITIAL_USER_LOGS_STATE,
    userReports: INITIAL_USER_REPORTS_STATE,
    userChecks: INITIAL_USER_CHECKS_STATE,
    sidenav: INITIAL_SIDENAV_STATE,
    mainMenu: INITIAL_MAIN_MENU
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

    // REGISTER PAGE
    registerUsername$: Observable<string> = this.select(
        state => state.registerPageData.registerUsername
    );
    registerPassword$: Observable<string> = this.select(
        state => state.registerPageData.registerPassword
    );
    firstLastName$: Observable<string> = this.select(state => state.registerPageData.firstLastName);
    email$: Observable<string> = this.select(state => state.registerPageData.email);

    // SIDENAV
    isSidenavOpened$: Observable<boolean> = this.select(state => state.sidenav.isSidenavOpened);
    sidenavMenuOptions$: Observable<EvahubSidenavMenuOption[]> = this.select(
        state => state.sidenav.sidenavMenuOptions
    );

    // MAIN MENU
    mainMenuItems$: Observable<EvahubMainMenuItem[]> = this.select(
        state => state.mainMenu.mainMenuItems
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
    selectedDocument$: Observable<EvahubDocument> = this.select(
        this.currentPageIndex$,
        this.currentDocumentId$,
        this.userLogs$,
        this.userReports$,
        this.userChecks$,

        (cpi, docId, ls, rs, cs) => {
            //console.log("in selectedDocument$ in store");
            switch (cpi) {
                case PageIndex.LOGS_PAGE:
                    const sl = ls.find(l => l.logId == docId);
                    //console.log("d logs, sl is:", sl);
                    return sl;

                case PageIndex.REPORTS_PAGE:
                    const sr = rs.find(r => r.reportId == docId);
                    //console.log("d reports, sr is:", sr);
                    return sr;

                case PageIndex.CHECKS_PAGE:
                    const sc = cs.find(c => c.checkId == docId);
                    //console.log("d checks, sc is:", sc);
                    return sc;
            }

            return new Log();
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

    // REGISTER PAGE:
    updateRegisterUsername(registerUsername: string) {
        this.updateState("registerPageData", "registerUsername", registerUsername);
    }

    updateRegisterPassword(registerPassword: string) {
        this.updateState("registerPageData", "registerPassword", registerPassword);
    }

    updateRegisterFirstLastName(firstLastName: string) {
        this.updateState("registerPageData", "firstLastName", firstLastName);
    }

    updateRegisterEmail(email: string) {
        this.updateState("registerPageData", "email", email);
    }

    resetRegisterPage() {
        this.updateRegisterUsername("");
        this.updateRegisterPassword("");
        this.updateRegisterFirstLastName("");
        this.updateRegisterEmail("");
    }

    // SIDENAV:

    updateIsSidenavOpened(isSidenavOpened: boolean) {
        this.updateState("sidenav", "isSidenavOpened", isSidenavOpened);
    }

    updateSidenavMenuOptions(sidenavMenuOptions: EvahubSidenavMenuOption[]) {
        this.updateState("sidenav", "sidenavMenuOptions", sidenavMenuOptions);
    }

    // MAIN MENU:

    updateMainMenuItems(items: EvahubMainMenuItem[]) {
        this.updateState("mainMenu", "mainMenuItems", items);
    }

    // GENERAL:

    updateUserDocuments(documentType: string, documents: any[]) {
        this.updateState("user" + documentType + "s", "user" + documentType + "s", documents);
    }

    updateSelectedUserDocument(documentType: string, doc: EvahubDocument) {
        const typ = "user" + documentType + "s";
        //console.log("typ is:", typ);

        this.updateState("user" + documentType + "s", "selectedUserDocument", doc);
    }

    // APPLICATION STATE:

    resetApplicationState() {
        this.setState(INITIAL_APPLICATION_STATE);
    }
}
