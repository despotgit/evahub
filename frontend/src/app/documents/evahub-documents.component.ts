import {
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit
} from "@angular/core";
import { PageIndexDictionary, getPageNameFromPageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubDocument
} from "../services/application-state-store.service";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, of, startWith, take, tap } from "rxjs";
import { Log } from "../models/Log";
//import { Chart } from "chart.js";
import Chart from "chart.js/auto";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit, AfterViewChecked, AfterViewInit {
    displayGraph: boolean;
    reportGraph: any;

    graphValues = [];
    graphLabels = [];

    selectedDocument$ = this.store.selectedDocument$.pipe(
        tap(d => {
            //console.log("and the a is:", a);
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

    currentPageIndex$ = this.store.currentPageIndex$.pipe(
        tap(a => {
            let pageName = getPageNameFromPageIndex(a);
            console.log("pageName is: ", pageName);
            if (pageName == "report") {
                this.displayGraph = true;
            } else {
                this.displayGraph = false;
            }
        })
    );

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

    ngOnInit(): void {}

    ngAfterViewChecked() {
        if (this.displayGraph) {
            this.drawGraph();
        }
    }

    ngAfterViewInit() {}

    drawGraph() {
        const el = document.getElementById("graph") as HTMLCanvasElement;
        const ctx = el.getContext("2d");

        // If graph exists, destroy it first
        if (this.reportGraph !== undefined) {
            this.reportGraph.destroy();
        }

        console.log("values for graph is:", this.graphValues);

        // generate labels, procedure:
        /*
            1. sort values.
            2. go from minimum value to max. value
            3. calculate the minimum interval
            4.





        */

        this.reportGraph = new Chart(ctx, {
            type: "scatter",
            data: {
                labels: this.graphLabels,
                datasets: [
                    {
                        label: "our first graph",
                        data: this.graphValues,
                        borderWidth: 1,
                        borderColor: "black",
                        pointBackgroundColor: ["#000", "#00bcd6", "#d300d6"],
                        pointBorderColor: ["#000", "#00bcd6", "#d300d6"],
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        fill: false,
                        tension: 0,
                        showLine: true
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
