import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";

export interface SidenavState {
    opened: boolean;
}

export const INITIAL_SIDENAV_STATE = {
    opened: false
};

@Injectable({
    providedIn: "root"
})
export class SidenavStoreService extends ComponentStore<SidenavState> {
    opened$: Observable<boolean> = this.select(state => state.opened);

    constructor() {
        super();
    }

    updateOpened(opened: boolean) {
        this.patchState({ opened });
    }

    resetSidenavState() {
        this.setState(INITIAL_SIDENAV_STATE);
    }
}
