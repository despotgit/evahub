import { AfterViewChecked, Component, Input } from "@angular/core";
//import { Chart } from "chart.js";
import Chart from "chart.js/auto";

@Component({
    selector: "app-documents-graph",
    templateUrl: "./documents-graph.component.html",
    styleUrls: ["./documents-graph.component.scss"]
})
export class DocumentsGraphComponent implements AfterViewChecked {
    @Input()
    graphLabels: any;

    @Input()
    graphValues: any;

    reportGraph: Chart;

    ngAfterViewChecked() {
        this.drawGraph();
    }

    drawGraph() {
        const el = document.getElementById("graph") as HTMLCanvasElement;
        const ctx = el.getContext("2d");

        // If graph exists, destroy it first
        if (this.reportGraph !== undefined) {
            this.reportGraph.destroy();
        }

        let dotsColors = ["green"];

        this.reportGraph = new Chart(ctx, {
            type: "scatter",
            data: {
                labels: this.graphLabels,
                datasets: [
                    {
                        label: "",
                        data: this.graphValues,
                        borderWidth: 1,
                        borderColor: "black",
                        pointBackgroundColor: dotsColors,
                        pointBorderColor: dotsColors,
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        fill: false,
                        tension: 0,
                        showLine: true
                    }
                ]
            },
            options: {
                maintainAspectRatio: true,
                scales: {
                    x: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                //console.log("value is: ", value, " index is: ", index);
                                return value;
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
