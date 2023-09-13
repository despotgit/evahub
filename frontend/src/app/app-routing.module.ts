import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { EvahubDocumentsComponent } from "./documents/evahub-documents.component";
import { UserFileUploadComponent } from "./user-file-upload/user-file-upload.component";

const routes: Routes = [
    { path: "", redirectTo: "documents/logs", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "user-file-upload", component: UserFileUploadComponent, canActivate: [AuthGuard] },
    {
        path: "documents/:documentType",
        component: EvahubDocumentsComponent,
        canActivate: [AuthGuard]
    },
    { path: "**", component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
