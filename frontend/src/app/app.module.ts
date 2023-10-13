// Modules
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { VladosMaterialModule } from "./vlados.material.module";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { IonicModule } from "@ionic/angular";
import { StoreModule } from "@ngrx/store";

// Components
import { documentsReducer } from "./store/reducers/documents.reducer";
import { GearsSpinnerComponent } from "./gears-spinner/gears-spinner.component";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { EvahubDocumentsComponent } from "./documents/evahub-documents.component";
import { EvahubSidenavComponent } from "./evahub-sidenav/evahub-sidenav.component";
import { DeleteDocumentConfirmationDialogComponent } from "./dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { DocumentsGraphComponent } from "./documents/documents-graph/documents-graph.component";
import { DocumentsTextComponent } from "./documents/documents-text/documents-text.component";
import { EvahubGraphControlsComponent } from "./documents/documents-graph/evahub-graph-controls/evahub-graph-controls.component";
import { DocumentUploadFormComponent } from "./documents/document-upload-form/document-upload-form.component";
import { DocumentNewProjectFormComponent } from "./documents/document-new-project-form/document-new-project-form.component";
import { DocumentsProjectComponent } from "./documents/documents-project/documents-project.component";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        EvahubDocumentsComponent,
        EvahubSidenavComponent,
        MainMenuComponent,
        DocumentsGraphComponent,
        DocumentsTextComponent,
        DeleteDocumentConfirmationDialogComponent,
        GearsSpinnerComponent,
        EvahubGraphControlsComponent,
        DocumentUploadFormComponent,
        DocumentNewProjectFormComponent,
        DocumentsProjectComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        VladosMaterialModule,
        DragDropModule,
        IonicModule.forRoot(),
        StoreModule.forRoot({ documents: documentsReducer })
        //StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
    ],

    providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
