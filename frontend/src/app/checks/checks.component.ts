import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    Check,
    EvahubSidenavMenuOption,
    Report
} from "../services/application-state-store.service";
import { tap } from "rxjs";

@Component({
    selector: "app-checks",
    templateUrl: "./checks.component.html",
    styleUrls: ["./checks.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecksComponent implements OnInit {
    userChecks$: Observable<Check[]> = this.store.userChecks$;
    selectedUserChecks$: Observable<Check> = this.store.selectedUserCheck$.pipe(
        tap(a => {
            console.log("in tap in Checks, a is:", a);
        })
    );

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        console.log("in ngOnInit of checks");
        this.initUserChecksList();
        this.store.updateCurrentPageIndex(PageIndex.CHECKS_PAGE);
    }

    userCheckSelected(checkId: number) {
        console.log("doing something with", checkId);
    }

    initUserChecksList() {
        let username = "test2";

        let url = `${environment.baseApiBackendUrl}/rest/checks/get/${username}`;

        this.httpClient
            .get(url)
            .pipe(
                map(ur => {
                    let u: any = ur;

                    this.store.updateUserChecks(u.userChecks);
                    this.processChecks(u.userChecks);

                    return ur;
                })
            )
            .subscribe();
    }

    processChecks(cs: Check[]) {
        console.log("checks are: ", cs);

        const menuOptions = cs.map(r => {
            let mo: EvahubSidenavMenuOption = {
                id: r.checkId,
                label: r.checkName
            };
            return mo;
        });

        this.store.updateSidenavMenuOptions(menuOptions);

        this.store.updateSelectedUserCheck(cs[0]);
    }
}
