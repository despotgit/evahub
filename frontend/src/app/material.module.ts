import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSliderModule,
    MatSidenavModule,
    MatStepperModule,
    MatInputModule],
  exports: [
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSliderModule,
    MatSidenavModule,
    MatStepperModule,
    MatInputModule]
})
export class VladosMaterialModule {

}