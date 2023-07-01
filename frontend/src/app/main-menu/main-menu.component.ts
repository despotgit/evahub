import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";

import { EvahubMainMenuItem, PageIndexEnum } from "../common/constants";

@Component({
    selector: "evahub-main-menu",
    templateUrl: "./main-menu.component.html",
    styleUrls: ["./main-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit {
    mainMenuItems: EvahubMainMenuItem[];
    @Input() set menuItems(mis: EvahubMainMenuItem[]) {
        this.mainMenuItems = mis;
    }

    pageSelected: PageIndexEnum;
    @Input() set cpi(cpi: PageIndexEnum) {
        this.pageSelected = cpi;
    }

    @Output() itemClickedEmit: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    itemClicked(e) {
        this.itemClickedEmit.emit(e);
    }
}
