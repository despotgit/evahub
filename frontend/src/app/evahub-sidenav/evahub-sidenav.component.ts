import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";

@Component({
    selector: "app-evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    opened: boolean;

    @ViewChild("sidenav") sidenav;

    constructor() {}

    ngOnInit(): void {}

    ngOnDestroy() {}
}
