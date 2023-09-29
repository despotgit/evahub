import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { PageIndexDictionary } from "../common/constants";
import { ApplicationStateStoreService } from "../store/application-state-store";
import { ActivatedRoute } from "@angular/router";
import {
    combineLatestWith,
    filter,
    map,
    Observable,
    skip,
    skipUntil,
    skipWhile,
    startWith,
    Subject,
    Subscription,
    switchMap,
    tap,
    withLatestFrom
} from "rxjs";
import { Log } from "../models/Log";
import { GraphDataset } from "../common/datasets";
import { HttpClient } from "@angular/common/http";
import { getDocumentTypeAsStringFromNumber, getPageNameFromPageIndex } from "../common/common";
import { ofType } from "@ngrx/effects";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit {
    username$ = this.store.username$;
    logs$ = this.store.userLogs$;
    currentDocumentType$ = this.store.currentDocumentType$;
    currentDocumentTypeString$ = this.currentDocumentType$.pipe(
        map(cdt => {
            return getDocumentTypeAsStringFromNumber(cdt);
        })
    );
    selectedDocument$ = this.store.selectedDocument$.pipe(
        tap(d => {
            //console.log("DEV:  WINNER IS:d is:", d);
            if (!d || !d["reportContent"] || !d["reportContent"]["BalDura_sub_plot"]) {
            } else {
                this.formGraphData(d, "BalDura_sub_plot");
            }
        })
        //startWith(new Log())
    );
    projectLogs$ = this.selectedDocument$.pipe(
        combineLatestWith(this.logs$, this.currentDocumentTypeString$),
        filter(([sd, ls, dt]) => {
            if (sd && sd.documentType) {
                let currentDocumentsType = getDocumentTypeAsStringFromNumber(sd.documentType);
                return dt == "project" && currentDocumentsType == "project";
            } else {
                return false;
            }
        }),
        map(([sd, ls, dt]) => {
            let projectLogIds = sd.projectLogIds;

            let res = ls.filter(l => {
                let isIt = projectLogIds.map(pli => +pli).indexOf(l.logId) != -1;

                return isIt;
            });

            return res;
        }),
        tap(p => {
            //
        })
    );
    graphDatasets$: Observable<any> = this.store.selectedDocument$.pipe(
        map(a => {
            //let dss = <any>[]; // datasets for the x and y axes
            let dss: Array<GraphDataset> = [];

            if (a && a["reportContent"]) {
                let predefinedSets = ["BalDura_UIP_plot", "BalDura_sub_plot"];

                for (let i = 0; i < predefinedSets.length; i++) {
                    let newDataset: GraphDataset = {
                        datasetName: predefinedSets[i],
                        value: a["reportContent"][predefinedSets[i]]
                    };

                    dss.push(newDataset);
                    //console.log("value is:", a["reportContent"][predefinedSets[i]]);
                }
            }
            return dss;
        }),
        startWith([1, 3, 5])
    );
    displayGraph$: Observable<boolean> = this.store.currentPageIndex$.pipe(
        map(a => {
            let pageName = getPageNameFromPageIndex(a);
            //console.log("pageName is: ", pageName);
            if (pageName.toLowerCase() == "report") {
                this.displayGraph = true;
                return true;
            } else {
                this.displayGraph = false;
                return false;
            }
        })
    );
    shouldDisplaydocumentSpinner$ = this.store.shouldDisplayDocumentSpinner$;
    gdsc$: Subject<any> = new Subject(); // Graph Data Set Change
    dcd$: Observable<any> = this.gdsc$.pipe(
        // Document Change Derived observable
        withLatestFrom(this.store.selectedDocument$),
        map(e => {
            console.log("e is:", e);
            this.formGraphData(e[1], e[0]);
            return e;
        })
    );
    isInDocumentUploadMode$ = this.store.isInDocumentUploadMode$;
    isInNewProjectCreationMode$ = this.store.isInNewProjectCreationMode$;

    // Related to new project page
    newProjectName$ = this.store.newProjectName$;
    newProjectDescription$ = this.store.newProjectDescription$;
    newProjectSelectedLogs$ = this.store.newProjectSelectedLogs$;

    displayGraph: boolean;
    graphValues: Array<number> = [];
    graphLabels: Array<number> = [];

    fileName = "";
    uploadProgress: number;
    uploadObs$: Observable<any>;
    uploadSub$: Subscription;

    constructor(
        private store: ApplicationStateStoreService,
        route: ActivatedRoute,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);

        this.updatePageIndexAccordingToRoute(route);
        this.displayGraph = true;
    }

    updatePageIndexAccordingToRoute(route) {
        const urlEnd = route.snapshot.url[1].path;
        //console.log("urlEnd is:", urlEnd);
        let pi = PageIndexDictionary.log.pageIndex;
        try {
            pi = PageIndexDictionary[urlEnd].pageIndex;
        } catch (e) {
            console.log();
        }
        //console.log("pageIndex is:", pageIndex);
        this.store.updateCurrentPageIndex(pi);
    }

    onDocumentContentDisplayed() {
        this.store.updateShouldDisplayEvahubDocumentSpinner(false);
    }

    ngOnInit(): void {}

    onGraphDatasetChange(e) {
        console.log("in evahub documents comp, onGraphDatasetChange, e is:", e);
        this.gdsc$.next(e);
    }

    formGraphData(document, whichSet) {
        this.graphValues = [];
        this.graphLabels = [];
        if (document["reportContent"] && document["reportContent"][whichSet]) {
            document["reportContent"][whichSet].forEach(el => {
                this.graphLabels.push(el[0]);
                this.graphValues.push(el[1]);
            });
        }
    }

    ngOnDestroy() {}
}
