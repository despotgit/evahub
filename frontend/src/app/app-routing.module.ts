import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { EvahubDocumentsComponent } from "./documents/evahub-documents.component";
import { UserFileUploadComponent } from "./user-file-upload/user-file-upload.component";

const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "upload", component: UserFileUploadComponent, canActivate: [AuthGuard] },
    //{ path: "logs", component: LogsComponent, canActivate: [AuthGuard] },
    //{ path: "checks", component: ChecksComponent, canActivate: [AuthGuard] },
    //{ path: "reports", component: ReportsComponent, canActivate: [AuthGuard] },
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
