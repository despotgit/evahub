import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface HomePageDataState {
  firstLastName: string;
  address: string;

}

@Injectable({
  providedIn: 'root'
})
export class HomePageDataStoreService extends ComponentStore<HomePageDataState> {

  constructor() {
    super();

  }

  firstLastName$: Observable<string> = this.select(state => state.firstLastName);
  address$: Observable<string> = this.select(state => state.address);


  updateFirstLastName(firstLastName: string) {
    this.patchState({ firstLastName });
  }

  updateAddress(address: string) {
    this.patchState({ address });
  }


}
