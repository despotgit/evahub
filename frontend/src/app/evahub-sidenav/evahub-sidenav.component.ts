import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

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

    @Output()
    emitItemClicked: EventEmitter<number> = new EventEmitter();

    constructor(private store: ApplicationStateStoreService) {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
    }
}
