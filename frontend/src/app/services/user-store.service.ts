import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface UserState {
  username: string;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends ComponentStore<UserState> {

  constructor() {
    super();

  }

  $username: Observable<string> = this.select(state => state.username);
  $isLoggedIn: Observable<boolean> = this.select(state => state.isLoggedIn);

  updateUsername(username: string) {
    this.patchState({ username }); // self-explaining syntax
  }

  updateIsLoggedIn(isLoggedIn: boolean) {
    this.patchState({ isLoggedIn }); // self-explaining syntax
  }

}
