import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import {
    map,
    switchMap,
    Observable,
    of,
    Subscription,
    tap,
    combineLatest,
    distinctUntilChanged,
    debounceTime,
    Subject,
    withLatestFrom
} from "rxjs";

import { PageIndexEnum, PageIndexDictionary } from "./common/constants";
import { Check } from "./models/Check";
import { EvahubDocument } from "./models/EvahubDocument";
import { EvahubDocumentType } from "../app/common/constants";
import { Log } from "./models/Log";
import { Report } from "./models/Report";
import { Project } from "./models/Project";
import { ApplicationStateStoreService } from "./store/application-state-store";
import { EvahubSidenavMenuItem } from "./common/constants";
import { AuthenticationService } from "./services/authentication.service";
import { RestApiClient } from "./services/rest-api-client.service";
import {
    getDocumentTypeAsNumberFromString,
    getDocumentTypeAsStringFromNumber,
    getPageNameFromPageIndex
} from "./common/common";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
    username$: Observable<string> = this.store.username$;
    isLoggedIn$: Observable<boolean> = this.store.isloggedIn$;
    isSidenavOpened$: Observable<boolean> = this.store.isSidenavOpened$;
    sidenavMenuItems$: Observable<EvahubSidenavMenuItem[]> = this.store.sidenavMenuItems$;
    userProjects$: Observable<Log[]> = this.store.userProjects$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    currentPageIndex$ = this.store.currentPageIndex$.pipe(
        tap(_ => {
            // first reset the sidenav menu, and put spinner while it loads
            this.store.resetSidenavMenuItems();
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(a => {
            // var s is a singularDocumentTypeName
            const s: string = getPageNameFromPageIndex(a);

            if (s == "project") {
                this.updateDocumentsSetFromApi("log", false);
            }

            if (PageIndexDictionary[s].isDocumentsPage) {
                this.updateDocumentsSetFromApi(s);
                this.store.updateCurrentDocumentType(getDocumentTypeAsNumberFromString(s));
            }

            this.currentPageIndex = a;
        })
    );
    //hook to switch off creation flags when switching to a new page:
    disengageCreationMode$ = this.currentPageIndex$.pipe(
        tap(a => {
            this.store.updateIsInDocumentUploadMode(false);
            this.store.updateIsInNewProjectCreationMode(false);
        })
    );
    isInDocumentUploadMode$ = this.store.isInDocumentUploadMode$;
    isInNewProjectCreationMode$ = this.store.isInNewProjectCreationMode$;
    currentDocumentSet$ = this.currentPageIndex$.pipe(
        switchMap(cpi => {
            switch (cpi) {
                case PageIndexEnum.PROJECTS_PAGE:
                    return this.userProjects$;

                case PageIndexEnum.LOGS_PAGE:
                    return this.userLogs$;

                case PageIndexEnum.REPORTS_PAGE:
                    return this.userReports$;

                case PageIndexEnum.CHECKS_PAGE:
                    return this.userChecks$;

                default:
                    return of([]);
            }
        }),
        withLatestFrom(this.isInNewProjectCreationMode$),
        map(([cds, is]) => {
            let d = cds[0];
            if (d !== undefined && !is) {
                // If document exists (is not undefined), select that first one, but
                // if the project creation mode is on, don't select the first document,
                // because there is still the success message displayed, and
                // not the document itself, so no automatic document selection ought
                // to occur

                this.store.updateIsEmptyDocumentPage(false);
                this.store.updateCurrentDocumentId(d.getDocumentId());
            } else {
                this.store.updateCurrentDocumentId(0);
            }

            return cds;
        })
    );
    currentDocumentId$ = this.store.currentDocumentId$;
    currentDocumentType$ = this.store.currentDocumentType$;
    mainMenuItems$ = this.store.mainMenuItems$;
    shouldDisplayRegisterButton$ = combineLatest([this.store.isloggedIn$, this.store.currentPageIndex$]).pipe(
        map(([ili, cpi]) => {
            //console.log("ili and cpi is:", ili, cpi);
            if (!ili && cpi != PageIndexEnum.REGISTER_PAGE) {
                return true;
            } else {
                return false;
            }
        })
    );
    shouldDisplayLoginButton$ = combineLatest([this.store.isloggedIn$, this.store.currentPageIndex$]).pipe(
        map(([ili, cpi]) => {
            //console.log("ili and cpi is:", ili, cpi);
            //console.log("login page index is:", PageIndex.LOGIN_PAGE);
            if (!ili && cpi != PageIndexEnum.LOGIN_PAGE) {
                return true;
            } else {
                return false;
            }
        })
    );
    shouldDisplaySidenavSpinner$ = this.store.shouldDisplaySidenavSpinner$;
    shouldDisplayDocumentSpinner$ = this.store.shouldDisplayDocumentSpinner$;
    sideMenuItemClickedSubject$: Subject<any> = new Subject();
    smicd$: Observable<any> = this.sideMenuItemClickedSubject$.pipe(
        // Menu Item Clicked Derived obs.
        // distinctUntilChanged(), // this would be the other way to restrict if it's the same
        withLatestFrom(this.currentDocumentId$),
        map(([smi, cdi]) => {
            if (smi == cdi) {
            } else {
                //console.log("mic is:", mic);
                //console.log("cdi is:", cdi);

                this.store.updateShouldDisplayEvahubDocumentSpinner(true);
                this.store.updateCurrentDocumentId(smi);
            }
        })
    );
    documentDeleteClickedSubject$: Subject<any> = new Subject();
    ddcd$: Observable<any> = this.documentDeleteClickedSubject$.pipe(
        // document delete clicked derived observable
        withLatestFrom(this.sidenavMenuItems$),
        map(([docId, snmi]) => {
            docId = docId.id;
            console.log("snmi is:", snmi);
        })
    );
    updateDocumentsSetFromApi$ = this.store.updateDocumentsSetFromApi$;
    updateDocumentsSetFromApiDerived$: Observable<any> = this.updateDocumentsSetFromApi$.pipe(
        tap(a => {
            console.log("tapped!!!!, a is:");
            console.log(a);
            if (a == EvahubDocumentType.project) {
                console.log("yes it is a project.");
                this.updateDocumentsSetFromApi(
                    getDocumentTypeAsStringFromNumber(EvahubDocumentType.project),
                    true
                );
            }
        })
    );

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndexEnum.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";
    httpDocsCall: Subscription;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService,
        private restApiClient: RestApiClient
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    // e can be string or a full PageIndexDictionary property
    goTo(e) {
        if (typeof e == "string") {
            e = PageIndexDictionary[e];
            console.log("e is:", e);
        }
        const isDocumentsPage = e.isDocumentsPage;
        const page = e.gotoParam;

        const pageToLower: string = page.toLowerCase();

        let newPageIndex = PageIndexDictionary[pageToLower].pageIndex;

        if (newPageIndex == this.currentPageIndex) {
        } else {
            if (isDocumentsPage) {
                this.router.navigate(["/documents/" + pageToLower]);
            } else {
                this.router.navigate(["/" + pageToLower]);
            }

            this.store.updateCurrentPageIndex(newPageIndex);
            this.store.updateShouldDisplaySidenavSpinner(true);
        }
    }

    logOut() {
        this.authenticationService.logOut();
    }

    sideMenuItemClicked($event) {
        //console.log("in app in menuItemClicked, $event is:", $event);
        this.store.updateIsInDocumentUploadMode(false);
        this.store.updateIsInNewProjectCreationMode(false);

        this.sideMenuItemClickedSubject$.next($event);

        return;
    }

    deleteMenuItemClicked = this.store.effect<{
        source: Event;
        itemId: number;
    }>(event$ =>
        event$.pipe(
            tap<{ source: Event; itemId: number }>(event => {
                event.source.stopPropagation();
            }),
            withLatestFrom(this.sidenavMenuItems$, this.username$, this.currentDocumentType$),
            map(data => {
                //console.log("data in effect is:");
                //console.log(data);

                let docId = data[0].itemId;
                let snmis = data[1];
                let un = data[2];
                let dt = data[3];

                let dType = getDocumentTypeAsStringFromNumber(dt);

                // Do database/API call, if needed
                this.restApiClient.deleteDocument(docId, un, dType).subscribe();

                // Remove UI element
                let newSnmi = snmis.filter(mi => mi.id != docId);
                console.log("newSnmi is:", newSnmi);
                this.store.updateSidenavMenuItems(newSnmi);
                this.store.updateIsEmptyDocumentPage(true);
            })
        )
    );

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    // docType is document name as string, singular form
    updateDocumentsSetFromApi(docType: string, fillSidenav: boolean = true) {
        if (docType == undefined) return;
        //console.log("!!!!!docType is:", docType);
        let docTypeToLower = docType.toLowerCase();
        //console.log("docType is:", docType);

        this.httpDocsCall = this.username$
            .pipe(
                switchMap(username => {
                    return this.restApiClient.getDocumentsSet(docTypeToLower, username);
                }),
                map(ud => {
                    //console.log("ud is:", ud);
                    //let ds = ud["user" + docType + "s"];
                    let ds = ud["userDocuments"];
                    //console.log("in updateDocumentsSetFromApi, fillSidenav is:", fillSidenav);
                    this.processDocuments(ds, docType, fillSidenav);
                    this.store.updateShouldDisplaySidenavSpinner(false);
                    return ud;
                })
            )
            .subscribe();
    }

    // Runs as part of fetching the data from API backend
    processDocuments(ds: any[], dt: string, fillSidenav: boolean = true) {
        //console.log("in process ds is:", ds);

        const dtToLower = dt.toLowerCase();
        //let [menuItems, docs] = this.transformDbDocuments(ds, dtToLower);
        let res = this.transformDbDocuments(ds, dtToLower);
        let menuItems = res.menuItems;
        let docs = res.docs;
        //console.log("menuItems are: ", menuItems);
        //console.log("about to updateUserDocuments of type: ", dt);
        this.store.updateUserDocuments(dt, docs);
        if (fillSidenav) {
            this.store.updateSidenavMenuItems(menuItems);
        }
    }

    // Returns menuItems[] and EvahubDocuments[]
    transformDbDocuments(ds: any, dtToLower) {
        let docs: EvahubDocument[] = [];
        let menuItems: EvahubSidenavMenuItem[] = [];

        if (ds.count === 0) {
            menuItems = [];
            docs = [];
        } else {
            ds.map(d => {
                let doc;
                switch (dtToLower) {
                    case "project":
                        doc = new Project();
                        //console.log("is a project");
                        break;
                    case "log":
                        doc = new Log();
                        //console.log("is a log");
                        break;
                    case "report":
                        doc = new Report();
                        //console.log("is a report");
                        break;
                    case "check":
                        doc = new Check();
                        //console.log("is a check");
                        break;
                }

                Object.keys(d).forEach(p => {
                    doc[p] = d[p];
                });

                if (dtToLower == "project") {
                    doc.projectLogIds = doc.projectLogs != "" ? doc.projectLogs.split(",") : [];
                }

                doc.documentType = EvahubDocumentType[dtToLower];

                docs.push(doc);

                let mo: EvahubSidenavMenuItem = {
                    id: doc.getDocumentId(),
                    label: doc.getDocumentName(),
                    selected: false
                };

                menuItems.push(mo);
            });
        }

        return { menuItems, docs };
    }

    onUploadNewDocumentClicked() {
        console.log("currentPageIndex is:", this.currentPageIndex);
        if (this.currentPageIndex == PageIndexEnum.PROJECTS_PAGE) {
            this.store.updateIsInNewProjectCreationMode(true);
            this.store.updateIsInDocumentUploadMode(false);
        } else {
            this.store.updateIsInDocumentUploadMode(true);
            this.store.updateIsInNewProjectCreationMode(false);
        }
        this.store.updateCurrentDocumentId(0);
    }

    onTriggerScriptClicked() {
        console.log();
        this.restApiClient.triggerScript().subscribe(r => {
            console.log("r is:", r);
        });
    }

    unSubscribe() {
        //this.docSelectedSub.unsubscribe();
        this.httpDocsCall.unsubscribe();
    }

    ngOnDestroy() {
        this.unSubscribe();
    }
}
