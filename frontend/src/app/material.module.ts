import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSliderModule,
    MatSidenavModule,
    MatStepperModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSliderModule,
    MatSidenavModule,
    MatStepperModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class VladosMaterialModule {

}