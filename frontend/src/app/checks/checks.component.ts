import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption,
    Check
} from "../services/application-state-store.service";

@Component({
    selector: "app-checks",
    templateUrl: "./checks.component.html",
    styleUrls: ["./checks.component.scss"]
})
export class ChecksComponent implements OnInit {
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    selectedUserCheck$: Observable<Check> = this.store.selectedUserCheck$;

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        this.initUserLogsList();
        this.store.updateCurrentPageIndex(PageIndex.CHECKS_PAGE);
    }

    userCheckSelected(checkId: number) {
        console.log("doing something with", checkId);
    }

    initUserLogsList() {
        let username = "a";
        username = "test2";
        let url = `${environment.baseApiBackendUrl}/rest/checks/get/${username}`;
        console.log("CHECKPOINT 1");

        this.httpClient
            .get(url)
            .pipe(
                map(ur => {
                    let u: any = ur;

                    this.processChecks(u.userChecks);

                    return ur;
                })
            )
            .subscribe();
    }

    processChecks(cs: Check[]) {
        this.store.updateUserChecks(cs);

        console.log("checks are: ", cs);

        const menuOptions = cs.map(c => {
            let mo: EvahubSidenavMenuOption = {
                id: c.checkId,
                label: c.checkName
            };
            return mo;

            //
        });

        console.log("menuOptions is:", menuOptions);

        this.store.updateSidenavMenuOptions(menuOptions);
        this.store.updateSelectedUserCheck(cs[0]);
    }
}
