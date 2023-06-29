import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { VladosMaterialModule } from "./vlados.material.module";
import { EvahubDocumentsComponent } from "./documents/evahub-documents.component";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { IonicModule } from "@ionic/angular";
import { EvahubSidenavComponent } from "./evahub-sidenav/evahub-sidenav.component";
import { UserFileUploadComponent } from "./user-file-upload/user-file-upload.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { MatSelectModule } from "@angular/material/select";
import { DocumentsGraphComponent } from "./documents/documents-graph/documents-graph.component";
import { DocumentsTextComponent } from "./documents/documents-text/documents-text.component";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { documentsReducer } from "./store/reducers/documents.reducer";
import { environment } from "../environments/environment";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        EvahubDocumentsComponent,
        EvahubSidenavComponent,
        UserFileUploadComponent,
        MainMenuComponent,
        DocumentsGraphComponent,
        DocumentsTextComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        VladosMaterialModule,
        IonicModule.forRoot(),
        StoreModule.forRoot({ documents: documentsReducer })
        //StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    ],

    providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
