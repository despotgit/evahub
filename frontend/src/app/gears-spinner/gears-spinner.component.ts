import { Component, Input } from "@angular/core";

@Component({
    selector: "app-gears-spinner",
    templateUrl: "./gears-spinner.component.html",
    styleUrls: ["./gears-spinner.component.scss"]
})
export class GearsSpinnerComponent {
    @Input()
    gearsSpinnerWidth: number;
}
