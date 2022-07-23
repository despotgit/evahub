import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption
} from "../services/application-state-store.service";

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    @Input()
    menuOptions: EvahubSidenavMenuOption[];

    constructor(private store: ApplicationStateStoreService) {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}
}
