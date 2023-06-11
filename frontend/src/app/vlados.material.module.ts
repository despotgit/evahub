import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
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
        ReactiveFormsModule,
        MatSelectModule
    ]
})
export class VladosMaterialModule {}
