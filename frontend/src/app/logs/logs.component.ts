import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PageIndex } from "../common/constants";
import {
    ApplicationStateStoreService,
    EvahubSidenavMenuOption,
    Log
} from "../services/application-state-store.service";

@Component({
    selector: "app-logs",
    templateUrl: "./logs.component.html",
    styleUrls: ["./logs.component.scss"]
})
export class LogsComponent implements OnInit {
    userLogs$: Observable<Log[]> = this.store.userLogs$;
    selectedUserLog$: Observable<Log> = this.store.selectedUserLog$;

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        this.initUserLogsList();
        this.store.updateCurrentPageIndex(PageIndex.LOGS_PAGE);
    }

    userReportSelected(logId: number) {
        console.log("doing something with", logId);
    }

    initUserLogsList() {
        let username = "a";
        username = "test2";
        let url = `${environment.baseApiBackendUrl}/rest/logs/get/${username}`;
        console.log("CHECKPOINT 1");

        this.httpClient
            .get(url)
            .pipe(
                map(ur => {
                    let u: any = ur;

                    this.processLogs(u.userLogs);

                    return ur;
                })
            )
            .subscribe();
    }

    processLogs(ls: Log[]) {
        this.store.updateUserLogs(ls);

        console.log("logs are: ", ls);

        const menuOptions = ls.map(l => {
            let mo: EvahubSidenavMenuOption = {
                id: l.logId,
                label: l.logName
            };
            return mo;

            //
        });

        console.log("menuOptions is:", menuOptions);

        this.store.updateSidenavMenuOptions(menuOptions);
        this.store.updateSelectedUserLog(ls[0]);
    }
}
