import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { PageIndex, PageIndexDictionary } from "../common/constants";
import { ApplicationStateStoreService } from "../services/application-state-store.service";
import { tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-evahub-documents",
    templateUrl: "./evahub-documents.component.html",
    styleUrls: ["./evahub-documents.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvahubDocumentsComponent implements OnInit {
    selectedDocument$ = this.store.selectedDocument$;

    constructor(private store: ApplicationStateStoreService, route: ActivatedRoute) {
        setTimeout(() => {
            this.store.updateIsSidenavOpened(true);
        }, 100);

        const urlEnd = route.snapshot.url[1].path;
        //console.log("urlEnd is:", urlEnd);
        const pageIndex = PageIndexDictionary[urlEnd];
        //console.log("pageIndex is:", pageIndex);
        this.store.updateCurrentPageIndex(pageIndex);
    }

    ngOnInit(): void {}
}
