import {
    AfterContentChecked,
    AfterViewChecked,
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";

@Component({
    selector: "app-documents-text",
    templateUrl: "./documents-text.component.html",
    styleUrls: ["./documents-text.component.scss"]
})
export class DocumentsTextComponent implements AfterViewChecked {
    ngAfterViewChecked(): void {
        this.emitContentDisplayed.emit(true);
    }

    @Input()
    documentContent;

    @Input()
    shouldDisplaySpinner;

    @Output()
    emitContentDisplayed: EventEmitter<boolean> = new EventEmitter();
}
