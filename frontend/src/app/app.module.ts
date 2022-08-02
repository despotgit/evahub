import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { VladosMaterialModule } from "./material.module";
import { EvahubDocumentsComponent } from "./documents/evahub-documents.component";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { IonicModule } from "@ionic/angular";
import { EvahubSidenavComponent } from "./evahub-sidenav/evahub-sidenav.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        EvahubDocumentsComponent,
        EvahubSidenavComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        VladosMaterialModule,
        IonicModule.forRoot()
    ],

    providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
