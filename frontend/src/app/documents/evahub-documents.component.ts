import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { PageIndexDictionary } from "../common/constants";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { ActivatedRoute } from "@angular/router";
import { map, startWith } from "rxjs";
import { Log } from "../models/Log";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit {
    selectedDocument$ = this.store.selectedDocument$.pipe(
        map(a => a),
        startWith(new Log())
    );

    constructor(private store: ApplicationStateStoreService, route: ActivatedRoute) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);

        const urlEnd = route.snapshot.url[1].path;
        //console.log("urlEnd is:", urlEnd);
        let pageIndex = PageIndexDictionary.log.index;
        try {
            pageIndex = PageIndexDictionary[urlEnd].index;
        } catch (e) {
            console.log();
        }
        //console.log("pageIndex is:", pageIndex);
        this.store.updateCurrentPageIndex(pageIndex);
    }

    ngOnInit(): void {}
}
