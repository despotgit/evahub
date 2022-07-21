import { Component, Input, OnDestroy, OnInit } from "@angular/core";

export interface EvahubSidenavMenuOption {
    id: number;
    label?: string;
    action?: string;
}

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    opened: boolean;

    @Input()
    menuOptions: EvahubSidenavMenuOption[];

    constructor() {}

    ngOnInit(): void {}

    ngOnDestroy() {}
}
