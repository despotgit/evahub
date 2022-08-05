import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";

import { EvahubMainMenuItem } from "../common/constants";

@Component({
    selector: "evahub-main-menu",
    templateUrl: "./main-menu.component.html",
    styleUrls: ["./main-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit {
    mainMenuItems: EvahubMainMenuItem[];
    @Input() set menuItems(mis: any[]) {
        console.log("*******", mis);
        this.mainMenuItems = mis;
    }
    //@Input() menuItems;

    @Output() itemClickedEmit: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    itemClicked(e) {
        this.itemClickedEmit.emit(e);
    }
}
