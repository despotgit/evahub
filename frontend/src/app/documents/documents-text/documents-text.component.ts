import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output
} from "@angular/core";

@Component({
    selector: "app-documents-text",
    templateUrl: "./documents-text.component.html",
    styleUrls: ["./documents-text.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsTextComponent implements AfterViewChecked {
    @Input()
    documentContent;

    @Input()
    shouldDisplaySpinner;

    @Output()
    emitContentDisplayed: EventEmitter<boolean> = new EventEmitter();

    ngAfterViewChecked(): void {
        this.emitContentDisplayed.emit(true);
    }
}
