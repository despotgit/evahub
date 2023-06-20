import {
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit
} from "@angular/core";
import { PageIndexDictionary, getPageNameFromPageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubDocument
} from "../services/application-state-store.service";
import { ActivatedRoute } from "@angular/router";
import {
    debounceTime,
    distinctUntilChanged,
    from,
    map,
    Observable,
    of,
    startWith,
    take,
    tap
} from "rxjs";
import { Log } from "../models/Log";
import Chart from "chart.js/auto";
import { FormControl } from "@angular/forms";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit, AfterViewInit {
    selectedDocument$ = this.store.selectedDocument$.pipe(
        tap(d => {
            //if (!d["reportContent"]["BalDura_sub_plot"]) {
            if (!d || !d["reportContent"] || !d["reportContent"]["BalDura_sub_plot"]) {
            } else {
                this.graphValues = [];
                this.graphLabels = [];
                d["reportContent"]["BalDura_sub_plot"].forEach(el => {
                    this.graphLabels.push(el[0]);
                    this.graphValues.push(el[1]);
                });
            }
        }),
        startWith(new Log())
    );

    graphDatasets$: Observable<any> = this.store.selectedDocument$.pipe(
        map(a => {
            let dss = []; // datasets for the x and y axes

            if (a && a["reportContent"]) {
                let predefinedSets = ["BalDura_UIP_plot", "BalDura_sub_plot"];

                for (let i = 0; i < predefinedSets.length; i++) {
                    dss.push({
                        datasetName: predefinedSets[i],
                        value: a["reportContent"][predefinedSets[i]]
                    });
                    console.log("value is:", a["reportContent"][predefinedSets[i]]);
                }
            }
            return dss;
        }),
        startWith([1, 3, 5])
    );

    displayGraph$ = this.store.currentPageIndex$.pipe(
        map(a => {
            let pageName = getPageNameFromPageIndex(a);
            console.log("pageName is: ", pageName);
            if (pageName == "report") {
                this.displayGraph = true;
                return true;
            } else {
                this.displayGraph = false;
                return false;
            }
        })
    );

    shouldDisplaySpinner$ = this.store.shouldDisplayDocumentSpinner$;

    displayGraph: boolean;
    graphValues = [];
    graphLabels = [];

    graphDatasetsFormControl = new FormControl("");

    constructor(private store: ApplicationStateStoreService, route: ActivatedRoute) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);

        this.updatePageIndex(route);

        this.displayGraph = true;
    }

    updatePageIndex(route) {
        const urlEnd = route.snapshot.url[1].path;
        //console.log("urlEnd is:", urlEnd);
        let pageIndex = PageIndexDictionary.log.index;
        try {
            pageIndex = PageIndexDictionary[urlEnd].index;
        } catch (e) {
            console.log();
        }
        //console.log("pageIndex is:", pageIndex);
        this.store.updateCurrentPageIndex(pageIndex);
    }

    onDocumentContentDisplayed() {
        this.store.updateShouldEvahubDocumentsDisplaySpinner(false);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        //
    }

    onGraphDatasetChange(e) {
        console.log(e.value);
    }
}
