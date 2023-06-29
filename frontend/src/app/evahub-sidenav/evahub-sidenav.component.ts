import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { EvahubSidenavMenuItem } from "../store/application.state";
import { of } from "rxjs";

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
    emitDeleteItemClicked: EventEmitter<{ source: Event; itemId: number }> = new EventEmitter<{
        source;
        itemId;
    }>();

    constructor() {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}

    menuItemClicked(itemId) {
        this.emitItemClicked.emit(itemId);
    }

    deleteClicked($event, iid: number) {
        this.emitDeleteItemClicked.emit({ source: $event, itemId: iid });
    }
}
