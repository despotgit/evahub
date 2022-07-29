import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, tap, Observable } from "rxjs";
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
    styleUrls: ["./logs.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsComponent implements OnInit {
    userLogs$: Observable<Log[]> = this.store.userLogs$;
    selectedUserLog$: Observable<Log> = this.store.selectedUserLog$.pipe(
        tap(a => {
            console.log("in tap in Logs, a is:", a);
        })
    );

    constructor(private store: ApplicationStateStoreService, private httpClient: HttpClient) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);
    }

    ngOnInit(): void {
        console.log("in ngOnInit of Logs");
        this.initUserLogsList();
        this.store.updateCurrentPageIndex(PageIndex.LOGS_PAGE);
    }

    userLogSelected(logId: number) {
        console.log("doing something with", logId);
    }

    initUserLogsList() {
        let username = "test2";

        let url = `${environment.baseApiBackendUrl}/rest/logs/get/${username}`;

        this.httpClient
            .get(url)
            .pipe(
                map(ur => {
                    let u: any = ur;

                    this.store.updateUserLogs(u.userLogs);
                    this.processLogs(u.userLogs);

                    return ur;
                })
            )
            .subscribe();
    }

    processLogs(ls: Log[]) {
        console.log("logs are: ", ls);

        const menuOptions = ls.map(l => {
            let mo: EvahubSidenavMenuOption = {
                id: l.logId,
                label: l.logName
            };
            return mo;

            //
        });

        //console.log("menuOptions is:", menuOptions);

        this.store.updateSidenavMenuOptions(menuOptions);

        //console.log("ls[0] is", ls[0]);
        this.store.updateSelectedUserLog(ls[0]);
    }
}
