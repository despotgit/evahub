import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SidenavStoreService } from "../services/sidenav-store.service";

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
    opened$: Observable<boolean> = this.sidenavStore.opened$;

    @Input()
    menuOptions: EvahubSidenavMenuOption[];

    constructor(private sidenavStore: SidenavStoreService) {
        //
    }

    ngOnInit(): void {}

    ngOnDestroy() {}
}
