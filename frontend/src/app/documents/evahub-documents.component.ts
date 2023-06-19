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
import { from, map, Observable, of, startWith, take, tap } from "rxjs";
import { Log } from "../models/Log";
//import { Chart } from "chart.js";
import Chart from "chart.js/auto";
import { FormControl } from "@angular/forms";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit, AfterViewInit {
    toppingList: string[] = ["kecap", "majonez", "pavlaka"];

    selectedDocument$ = this.store.selectedDocument$.pipe(
        tap(d => {
            //console.log("and the a is:", a);
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

    toppings = new FormControl("");

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

    onContentDisplayed() {
        this.store.updateShouldEvahubDocumentsDisplaySpinner(false);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {}
}
