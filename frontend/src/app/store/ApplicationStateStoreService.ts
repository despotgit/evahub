import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { map, Observable, withLatestFrom, shareReplay, observeOn, asyncScheduler } from "rxjs";
import {
    EvahubMainMenuItem,
    EvahubSidenavMenuItem,
    PageIndex,
    capitalizeWord
} from "../common/constants";
import { Check } from "../models/Check";
import { EvahubDocument } from "../models/EvahubDocument";
import { Log } from "../models/Log";
import { Report } from "../models/Report";
import { ApplicationState, INITIAL_APPLICATION_STATE } from "./state/application.state";
import { updateState } from "./reducers/generic.quasi.reducer";

@Injectable({
    providedIn: "root"
})
export class ApplicationStateStoreService extends ComponentStore<ApplicationState> {
    // CURRENT USER
    username$: Observable<string> = this.select(state => state.currentUserSession.username);
    isloggedIn$: Observable<boolean> = this.select(state => state.currentUserSession.isLoggedIn);
    currentPageIndex$: Observable<number> = this.select(
        state => state.currentUserSession.currentPageIndex
    );
    currentDocumentId$: Observable<number> = this.select(
        state => state.currentUserSession.currentDocumentId
    );

    // REGISTER PAGE
    registerUsername$: Observable<string> = this.select(
        state => state.registerPageData.registerUsername
    );
    registerPassword$: Observable<string> = this.select(
        state => state.registerPageData.registerPassword
    );
    registerPasswordConfirmation$: Observable<string> = this.select(
        state => state.registerPageData.registerPasswordConfirmation
    );
    firstLastName$: Observable<string> = this.select(state => state.registerPageData.firstLastName);
    email$: Observable<string> = this.select(state => state.registerPageData.email);

    // EVAHUB DOCUMENT CONTENT
    shouldDisplayDocumentSpinner$: Observable<boolean> = this.select(
        state => state.documentContent.shouldDisplaySpinner
    );

    // SIDENAV
    isSidenavOpened$: Observable<boolean> = this.select(state => state.sidenav.isSidenavOpened);
    sidenavMenuItems$: Observable<EvahubSidenavMenuItem[]> = this.select(
        state => state.sidenav.sidenavMenuItems
    );

    // MAIN MENU
    mainMenuItems$: Observable<EvahubMainMenuItem[]> = this.select(
        state => state.mainMenu.mainMenuItems
    );

    // REPORTS
    userReports$: Observable<Report[]> = this.select(state => state.userReports);

    // LOGS
    userLogs$: Observable<Log[]> = this.select(state => state.userLogs);

    // CHECKS
    userChecks$: Observable<Check[]> = this.select(state => state.userChecks);

    switcher = 0;

    // DERIVED OBSERVABLES:
    selectedDocument$: Observable<EvahubDocument> = this.currentDocumentId$.pipe(
        withLatestFrom(this.currentPageIndex$, this.userLogs$, this.userReports$, this.userChecks$),
        map(([docId, cpi, ls, rs, cs]) => {
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
        }),
        shareReplay(1),
        observeOn(asyncScheduler)
    );

    constructor() {
        super();
    }

    // CURRENT USER:
    updateUsername(username: string) {
        updateState(this, "currentUserSession", "username", username);
    }

    updateIsLoggedIn(isLoggedIn: boolean) {
        updateState(this, "currentUserSession", "isLoggedIn", isLoggedIn);
    }

    updateCurrentPageIndex(currentPageIndex: number) {
        updateState(this, "currentUserSession", "currentPageIndex", currentPageIndex);
    }

    updateCurrentDocumentId(id: number) {
        updateState(this, "currentUserSession", "currentDocumentId", id);
    }

    // REGISTER PAGE:
    updateRegisterUsername(registerUsername: string) {
        updateState(this, "registerPageData", "registerUsername", registerUsername);
    }

    updateRegisterPassword(registerPassword: string) {
        updateState(this, "registerPageData", "registerPassword", registerPassword);
    }

    updateRegisterPasswordConfirmation(registerPasswordConfirmation: string) {
        updateState(
            this,
            "registerPageData",
            "registerPasswordConfirmation",
            registerPasswordConfirmation
        );
    }

    updateRegisterFirstLastName(firstLastName: string) {
        updateState(this, "registerPageData", "firstLastName", firstLastName);
    }

    updateRegisterEmail(email: string) {
        updateState(this, "registerPageData", "email", email);
    }

    resetRegisterPage() {
        this.updateRegisterUsername("");
        this.updateRegisterPassword("");
        this.updateRegisterPasswordConfirmation("");
        this.updateRegisterFirstLastName("");
        this.updateRegisterEmail("");
    }

    // EVAHUB DOCUMENTS CONTENT:
    updateShouldEvahubDocumentsDisplaySpinner(should: boolean) {
        updateState(this, "documentContent", "shouldDisplaySpinner", should);
    }

    // SIDENAV:
    updateIsSidenavOpened(isSidenavOpened: boolean) {
        updateState(this, "sidenav", "isSidenavOpened", isSidenavOpened);
    }

    updateSidenavMenuItems(sidenavMenuItems: EvahubSidenavMenuItem[]) {
        updateState(this, "sidenav", "sidenavMenuItems", sidenavMenuItems);
    }

    // MAIN MENU:
    updateMainMenuItems(items: EvahubMainMenuItem[]) {
        updateState(this, "mainMenu", "mainMenuItems", items);
    }

    // GENERAL:
    updateUserDocuments(documentType: string, documents: any[]) {
        documentType = capitalizeWord(documentType);
        updateState(this, "user" + documentType + "s", null, documents);
    }

    // APPLICATION STATE:
    resetApplicationState() {
        this.setState(INITIAL_APPLICATION_STATE);
    }
}
