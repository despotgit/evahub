import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";

export interface HomePageDataState {
    firstLastName: string;
    address: string;
}

export const INITIAL_HOMEPAGE_STATE = {
    firstLastName: "",
    address: ""
};

@Injectable({
    providedIn: "root"
})
export class HomePageDataStoreService extends ComponentStore<HomePageDataState> {
    constructor() {
        super();
    }

    firstLastName$: Observable<string> = this.select(state => state.firstLastName);
    address$: Observable<string> = this.select(state => state.address);

    updateFirstLastName(firstLastName: string) {
        console.log("in update store state!!!!");
        this.patchState({ firstLastName });
    }

    updateAddress(address: string) {
        this.patchState({ address });
    }

    resetHomepageState() {
        this.setState(INITIAL_HOMEPAGE_STATE);
    }
}
