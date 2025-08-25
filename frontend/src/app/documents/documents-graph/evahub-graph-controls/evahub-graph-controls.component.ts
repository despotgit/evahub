import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "evahub-graph-controls",
    templateUrl: "./evahub-graph-controls.component.html",
    styleUrls: ["./evahub-graph-controls.component.scss"]
})
export class EvahubGraphControlsComponent {
    @Input()
    graphValues: Array<number>;

    @Input()
    graphLabels: Array<number>;

    graphDatasetsFormControl = new FormControl("");

    @Input()
    datasets: any;

    @Output()
    graphDatasetChange: EventEmitter<string> = new EventEmitter();

    onGraphDatasetChange($event) {
        console.log("in out, event is:", $event);
        this.graphDatasetChange.emit($event.value);
    }
}

import { interval, fromEvent, takeUntil, timer } from 'rxjs';

const source = interval(1000);
const clicks = fromEvent(document, 'click');
const result = source.pipe(takeUntil(clicks));
result.subscribe(x => console.log(`time is now: ${x}`));

clicks.subscribe(() => {
    timer(2000).subscribe(() => {
        console.log('time has passed and we are here.');
    });
});

