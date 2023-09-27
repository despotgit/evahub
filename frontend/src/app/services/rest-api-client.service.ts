import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { Project } from "../models/Project";
import { getNewProjectUrl, getRegisterUrl } from "../common/common";

@Injectable({
    providedIn: "root"
})
export class RestApiClient {
    constructor(private httpClient: HttpClient) {}

    // docTypeToLower is singular
    getDocumentsSet(docTypeToLower, username) {
        //console.log("in getDocumentsSet docTypeToLower is", docTypeToLower);
        //console.log("in getDocumentsSet username is", username);
        let url = `${environment.baseApiBackendUrl}/rest/get/documents/type/${docTypeToLower}/username/${username}`;
        return this.httpClient.get(url);
    }

    deleteDocument(documentId: number, username: string, documentType: string) {
        let url = `${environment.baseApiBackendUrl}/rest/delete/document/id/${documentId}/username/${username}/document-type/${documentType}`;

        return this.httpClient.delete(url);
    }

    registerUser(un, pass, flname, email) {
        const formData = new FormData();

        formData.append("username", un);
        formData.append("password", pass);
        formData.append("firstLastName", flname);
        formData.append("email", email);

        console.log("******** formData is:", formData);

        let url = getRegisterUrl();
        //console.log("aaaand url is:", url);

        return this.httpClient.post(url, formData);
    }

    putNewDocument(url, formData) {
        return this.httpClient.put(url, formData, {
            reportProgress: true,
            observe: "events"
        });
    }

    createNewProject(projectName, projectDescription, logIds) {
        let data: any = Project;
        data.projectName = projectName;
        data.projectDescription = projectDescription;
        data.logIds = logIds;

        let url = getNewProjectUrl();
    }

    postNewProject(url, formData) {
        return this.httpClient.post(url, formData);
    }
}
