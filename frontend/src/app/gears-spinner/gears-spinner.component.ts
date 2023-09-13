import { Component, Input } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";

@Component({
    selector: "app-gears-spinner",
    templateUrl: "./gears-spinner.component.html",
    styleUrls: ["./gears-spinner.component.scss"]
})
export class GearsSpinnerComponent {
    @Input()
    gearsSpinnerWidth: number = 300;

    color: ThemePalette = "primary";
    mode: ProgressSpinnerMode = "indeterminate";

    value = 80;
}
