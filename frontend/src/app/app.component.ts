import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild
} from "@angular/core";
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

import {
    getPageNameFromPageIndex,
    PageIndexEnum,
    PageIndexDictionary,
    getDocumentTypeAsStringFromNumber,
    getDocumentTypeAsNumberFromString
} from "./common/constants";
import { Check } from "./models/Check";
import { EvahubDocument } from "./models/EvahubDocument";
import { EvahubDocumentTypeWordToNumber } from "../app/common/constants";
import { Log } from "./models/Log";
import { Report } from "./models/Report";
import { ApplicationStateStoreService } from "./store/application-state-store";
import { EvahubSidenavMenuItem } from "./common/constants";
import { AuthenticationService } from "./services/authentication.service";
import { RestApiService } from "./services/rest-api.service";

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
        tap(_ => {
            // first reset the sidenav menu, and put spinner while it loads
            this.store.resetSidenavMenuItems();
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(a => {
            // var s is a singularDocumentTypeName
            const s: string = getPageNameFromPageIndex(a);

            if (PageIndexDictionary[s].isDocumentsPage) {
                this.updateDocumentsSetFromApi(s);
                this.store.updateCurrentDocumentType(getDocumentTypeAsNumberFromString(s));
            }

            this.currentPageIndex = a;
        })
    );
    currentDocumentSet$ = this.currentPageIndex$.pipe(
        switchMap(cpi => {
            switch (cpi) {
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
    currentDocumentType$ = this.store.currentDocumentType$;
    mainMenuItems$ = this.store.mainMenuItems$;
    shouldDisplayRegisterButton$ = combineLatest([
        this.store.isloggedIn$,
        this.store.currentPageIndex$
    ]).pipe(
        map(([ili, cpi]) => {
            //console.log("ili and cpi is:", ili, cpi);
            if (!ili && cpi != PageIndexEnum.REGISTER_PAGE) {
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
            if (!ili && cpi != PageIndexEnum.LOGIN_PAGE) {
                return true;
            } else {
                return false;
            }
        })
    );
    shouldDisplayDocumentSpinner$ = this.store.shouldDisplayDocumentSpinner$;
    menuItemClickedSubject$: Subject<any> = new Subject();
    micd$: Observable<any> = this.menuItemClickedSubject$.pipe(
        //Menu Item Clicked Derived obs.
        // distinctUntilChanged(), // this would be the other way to restrict if it's the same
        withLatestFrom(this.currentDocumentId$),
        map(([mic, cdi]) => {
            if (mic == cdi) {
            } else {
                //console.log("mic is:", mic);
                //console.log("cdi is:", cdi);
                this.store.updateShouldEvahubDocumentsDisplaySpinner(true);
                this.store.updateCurrentDocumentId(mic);
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

    docSelectedSub: Subscription;

    currentPageIndex: number = PageIndexEnum.NONE_PAGE;

    @ViewChild("sidenav") sidenav;

    title = "EVAHUB";
    httpDocsCall: Subscription;

    constructor(
        private router: Router,
        private store: ApplicationStateStoreService,
        private authenticationService: AuthenticationService,
        private restApiClient: RestApiService
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
            newPageIndex = PageIndexDictionary[pageToLower].pageIndex;
        } else {
            this.router.navigate(["/" + pageToLower]);
            newPageIndex = PageIndexDictionary[pageToLower].pageIndex;
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

        this.menuItemClickedSubject$.next($event);

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
                console.log("data in effect is:");
                console.log(data);

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
            })
        )
    );

    updateCurrentPageIndex(cpi: number) {
        this.currentPageIndex = cpi;
        this.store.updateCurrentPageIndex(cpi);
    }

    // docType is document name as string, singular form
    updateDocumentsSetFromApi(docType: string) {
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
        //let [menuItems, docs] = this.transformDbDocuments(ds, dtToLower);
        let res = this.transformDbDocuments(ds, dtToLower);
        let menuItems = res.menuItems;
        let docs = res.docs;
        //console.log("menuItems are: ", menuItems);
        this.store.updateUserDocuments(dt, docs);
        this.store.updateSidenavMenuItems(menuItems);
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

                doc.documentType = EvahubDocumentTypeWordToNumber[dtToLower];

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

    unSubscribe() {
        this.docSelectedSub.unsubscribe();
        this.httpDocsCall.unsubscribe();
    }

    ngOnDestroy() {
        this.unSubscribe();
    }
}
