import { AfterViewChecked, ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PageIndexDictionary, getPageNameFromPageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubDocument
} from "../services/application-state-store.service";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, of, startWith, tap } from "rxjs";
import { Log } from "../models/Log";
//import { Chart } from "chart.js";
import Chart from "chart.js/auto";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit, AfterViewChecked {
    displayGraph: boolean;
    reportGraph: any;

    selectedDocument$ = this.store.selectedDocument$.pipe(
        map(a => a),
        startWith(new Log())
    );
    currentPageIndex$ = this.store.currentPageIndex$.pipe(
        tap(a => {
            let pageName = getPageNameFromPageIndex(a);
            if (pageName == "report") {
                this.displayGraph = true;
                this.displayGraph = false;
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

    drawGraph() {
        const el = document.getElementById("graph") as HTMLCanvasElement;
        const ctx = el.getContext("2d");

        // If graph exists, destroy it first
        if (this.reportGraph) {
            this.reportGraph.destroy();
        }

        let d = [12, 19, 3, 5, 2, 3];
        let ls = [];

        let currentLabel = 1;
        d.forEach(da => {
            ls.push(currentLabel++);
        });

        this.reportGraph = new Chart(ctx, {
            type: "line",
            data: {
                labels: ls,
                datasets: [
                    {
                        label: "# of Votes",
                        data: d,
                        borderWidth: 1
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
