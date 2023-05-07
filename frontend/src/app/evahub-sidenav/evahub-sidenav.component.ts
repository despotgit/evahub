import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { EvahubSidenavMenuItem } from "../services/application-state-store.service";

@Component({
    selector: "evahub-sidenav",
    templateUrl: "./evahub-sidenav.component.html",
    styleUrls: ["./evahub-sidenav.component.scss"]
})
export class EvahubSidenavComponent implements OnInit, OnDestroy {
    @Input()
    menuItems: EvahubSidenavMenuItem[];

    @Input()
    selectedDocumentId: number;

    @Output()
    emitItemClicked: EventEmitter<number> = new EventEmitter();

    @Output()
    emitDeleteItemClicked: EventEmitter<number> = new EventEmitter();

    constructor() {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
    }

    deleteClicked(itemId: number) {
        this.emitDeleteItemClicked.emit(itemId);
    }
}
