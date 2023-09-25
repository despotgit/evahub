import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { PageIndexDictionary, getPageNameFromPageIndex } from "../common/constants";
import { ApplicationStateStoreService } from "../store/application-state-store";
import { ActivatedRoute } from "@angular/router";
import {
    BehaviorSubject,
    finalize,
    map,
    Observable,
    startWith,
    Subject,
    Subscription,
    switchMap,
    tap,
    withLatestFrom
} from "rxjs";
import { Log } from "../models/Log";
import { FormControl } from "@angular/forms";
import { GraphDataset } from "../common/datasets";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit {
    selectedDocument$ = this.store.selectedDocument$.pipe(
        tap(d => {
            //console.log("d is:", d);
            if (!d || !d["reportContent"] || !d["reportContent"]["BalDura_sub_plot"]) {
            } else {
                this.formGraphData(d, "BalDura_sub_plot");
            }
        }),
        startWith(new Log())
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
            console.log("pageName is: ", pageName);
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
    currentDocumentType$ = this.store.currentDocumentType$;
    isInDocumentUploadMode$ = this.store.isInDocumentUploadMode$;
    isInNewProjectCreationMode$ = this.store.isInNewProjectCreationMode$;
    username$ = this.store.username$;

    @Input()
    requiredFileType: string = "png";

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

        this.updatePageIndex(route);

        this.displayGraph = true;
    }

    updatePageIndex(route) {
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

    onFileSelected(event) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            this.uploadObs$ = this.username$.pipe(
                switchMap(username => {
                    let url = `${environment.baseApiBackendUrl}/rest/put/document/document-type/log/username/${username}`;

                    return this.http.put(url, formData, {
                        reportProgress: true,
                        observe: "events"
                    });
                }),
                finalize(() => {
                    console.log("step 3, in finalize");
                    this.resetUpload();
                })
            );
        }
    }

    onUploadInitiated() {
        console.log("in onUploadInitiated in evahub documents");

        this.uploadSub$ = this.uploadObs$.subscribe(event => {
            if (event.type == HttpEventType.UploadProgress) {
                console.log("UPLOAD PROGRESS, event is:", event);
                const newProgress = Math.round(100 * (event.loaded / event.total));
                this.uploadProgress = newProgress;
                this.cd.markForCheck();
            }
        });
    }

    resetUpload() {
        if (this.uploadSub$) {
            this.uploadSub$.unsubscribe();
        }

        this.uploadProgress = 0;
        this.uploadSub$ = null;
    }

    ngOnDestroy() {
        this.resetUpload();
    }
}
