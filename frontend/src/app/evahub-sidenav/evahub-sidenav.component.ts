import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    opened: boolean;

    @Input()
    menuOptions: any[];

    constructor() {}

    ngOnInit(): void {}

    ngOnDestroy() {}
}
