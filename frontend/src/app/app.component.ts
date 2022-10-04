import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild
} from "@angular/core";
import { Router } from "@angular/router";

import { map, switchMap, Observable, of, Subscription, tap, combineLatest } from "rxjs";
import { environment } from "src/environments/environment";
import {
    getPageNameFromPageIndex,
    PageIndex,
    PageIndexDictionary,
    capitalizeWord
} from "./common/constants";
import { Check } from "./models/Check";
import { EvahubDocumentTypeDictionary } from "./models/EvahubDocument";
import { Log } from "./models/Log";
import { Report } from "./models/Report";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuItem
} from "./services/application-state-store.service";
import { AuthenticationService } from "./services/authentication.service";

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
    userReports$: Observable<Report[]> = this.store.userReports$;
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    userLogs$: Observable<Log[]> = this.store.userLogs$;
    currentPageIndex$ = this.store.currentPageIndex$.pipe(
        tap(a => {
            const s = getPageNameFromPageIndex(a); // s : singularDocumentTypeName

            const sc = capitalizeWord(s); // (Only first letter of the word is capital)

            if (PageIndexDictionary[s].isDocumentsPage) {
                this.updateDocumentsSetFromApi(sc);
            }
            this.currentPageIndex = a;
        })
    );
    currentDocumentSet$ = this.currentPageIndex$.pipe(
        switchMap(cpi => {
            switch (cpi) {
                case PageIndex.LOGS_PAGE:
                    return this.userLogs$;

                case PageIndex.REPORTS_PAGE:
                    return this.userReports$;

                case PageIndex.CHECKS_PAGE:
                    return this.userChecks$;

                default:
                    return of([]);
            }
        }),
        map(cds => {
            let d = cds[0];
            if (d !== undefined) {
                //console.log("first's getDocumentId is:", d.getDocumentId());
                this.store.updateCurrentDocumentId(d.getDocumentId());
            }

            return cds;
        })
    );
    currentDocumentId$ = this.store.currentDocumentId$;
    mainMenuItems$ = this.store.mainMenuItems$;
    shouldDisplayRegisterButton$ = combineLatest([
        this.store.isloggedIn$,
        this.store.currentPageIndex$
    ]).pipe(
        map(([ili, cpi]) => {
            //console.log("ili and cpi is:", ili, cpi);
            if (!ili && cpi != PageIndex.REGISTER_PAGE) {
                return true;
            } else {
                return false;
            }
        })
    );
    shouldDisplayLoginButton$ = combineLatest([
        this.store.isloggedIn$,
        this.store.currentPageIndex$
    ]).pipe(
        map(([ili, cpi]) => {
            //console.log("ili and cpi is:", ili, cpi);
            //console.log("login page index is:", PageIndex.LOGIN_PAGE);
            if (!ili && cpi != PageIndex.LOGIN_PAGE) {
                return true;
            } else {
                return false;
            }
        })
    );

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndex.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";
    httpDocsCall: any;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService,
        private httpClient: HttpClient
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

        let newPageIndex;
        if (isDocumentsPage) {
            this.router.navigate(["/documents/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower].index;
        } else {
            this.router.navigate(["/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower].index;
        }

        this.store.updateCurrentPageIndex(newPageIndex);
    }

    logOut() {
        this.authenticationService.logOut();
    }

    goRegister() {
        this.goTo;
    }

    menuItemClicked($event) {
        //console.log("in app in menuItemClicked, $event is:", $event);
        this.store.updateCurrentDocumentId($event);
        return;
    }

    deleteMenuItemClicked($event) {
        console.log("event is:", $event);

        this.deleteDocument($event.type, $event.itemId);

        return;
    }

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    // docType is document name as string, singular form
    updateDocumentsSetFromApi(docType: string) {
        if (docType == undefined) return;
        //console.log("!!!!!docType is:", docType);
        let docTypeToLower = docType.toLowerCase();

        this.httpDocsCall = this.username$
            .pipe(
                switchMap(username => {
                    let url = `${environment.baseApiBackendUrl}/rest/get/${docTypeToLower}s/${username}`;

                    return this.httpClient.get(url);
                }),
                map(ud => {
                    console.log("ud is:", ud);
                    let ds = ud["user" + docType + "s"];
                    this.processDocuments(ds, docType);
                    return ud;
                })
            )
            .subscribe();
    }

    // Runs as part of fetching the data from API backend
    processDocuments(ds: any[], dt: string) {
        //console.log("in process ds is:", ds);
        //console.log("in process dt is:", dt);

        const dtToLower = dt.toLowerCase();
        let [menuItems, docs] = this.transformDbDocuments(ds, dtToLower);
        this.store.updateUserDocuments(dt, docs);
        this.store.updateSidenavMenuItems(menuItems);
        this.store.updateSelectedUserDocument(dt, docs[0]);
    }

    // Returns menuItems[] and EvahubDocuments[]
    transformDbDocuments(ds: any, dtToLower) {
        let docs = [];
        let menuItems = [];

        ds.map(d => {
            let doc;
            switch (dtToLower) {
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

            doc.documentType = EvahubDocumentTypeDictionary[dtToLower];

            docs.push(doc);

            let mo: EvahubSidenavMenuItem = {
                id: doc.getDocumentId(),
                label: doc.getDocumentName(),
                selected: false,
                type: dtToLower
            };

            menuItems.push(mo);
        });

        return [menuItems, docs];
    }

    deleteDocument(type: string, id: number) {
        if (type == undefined) return;
        //console.log("!!!!!docType is:", docType);
        let docTypeToLower = type.toLowerCase();

        this.httpDocsCall = this.username$
            .pipe(
                switchMap(username => {
                    let url = `${environment.baseApiBackendUrl}/rest/delete/document/type/${docTypeToLower}/id/${id}/user/${username}`;

                    return this.httpClient.delete(url);
                }),
                map(result => {
                    console.log("result is:", result);
                    this.updateDocumentsSetFromApi(type);

                    return result;
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.docSelectedSub.unsubscribe();
        this.httpDocsCall.unsubscribe();
    }
}
