import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacySliderModule as MatSliderModule } from "@angular/material/legacy-slider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyProgressBarModule as MatProgressBarModule } from "@angular/material/legacy-progress-bar";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonModule,
        MatSliderModule,
        MatSidenavModule,
        MatInputModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatIconModule,
        MatMenuModule,
        MatGridListModule,
        MatCardModule,
        MatSidenavModule,
        MatDividerModule,
        MatProgressBarModule,
        ReactiveFormsModule
    ],
    exports: [
        MatFormFieldModule,
        MatToolbarModule,
        MatButtonModule,
        MatSliderModule,
        MatSidenavModule,
        MatInputModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatIconModule,
        MatMenuModule,
        MatGridListModule,
        MatCardModule,
        MatSidenavModule,
        MatDividerModule,
        MatProgressBarModule,
        ReactiveFormsModule
    ]
})
export class VladosMaterialModule {}
