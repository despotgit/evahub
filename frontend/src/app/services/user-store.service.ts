import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable } from "rxjs";

export interface UserState {
    username: string;
    isLoggedIn: boolean;
}

export const INITIAL_USER_STATE = {
    username: "",
    isLoggedIn: false
};

@Injectable({
    providedIn: "root"
})
export class UserStoreService extends ComponentStore<UserState> {
    constructor() {
        super();
    }

    username$: Observable<string> = this.select(state => state.username);
    isloggedIn$: Observable<boolean> = this.select(state => state.isLoggedIn);

    updateUsername(username: string) {
        this.patchState({ username }); // self-explaining syntax
    }

    updateIsLoggedIn(isLoggedIn: boolean) {
        this.patchState({ isLoggedIn }); // self-explaining syntax
    }

    resetUserState() {
        this.setState(INITIAL_USER_STATE);
    }
}
