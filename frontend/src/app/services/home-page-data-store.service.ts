import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface HomePageDataState {
  firstLastName: string;

}

@Injectable({
  providedIn: 'root'
})
export class HomePageDataStoreService extends ComponentStore<HomePageDataState> {

  constructor() {
    super();

  }

  firstLastName$: Observable<string> = this.select(state => state.firstLastName);


  updateFirstLastName(firstLastName: string) {
    this.patchState({ firstLastName });
  }


}
