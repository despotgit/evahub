import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root"
})
export class RestApiService {
    constructor(private httpClient: HttpClient) {}

    getDocumentsSet(docTypeToLower, username) {
        let url = `${environment.baseApiBackendUrl}/rest/get/documents/type/${docTypeToLower}/username/${username}`;
        return this.httpClient.get(url);
    }

    /*
    deleteDocument(documentType, documentId) {
        let url = `${environment.baseApiBackendUrl}/rest/delete/documents/type/${docTypeToLower}/id/${username}`;

        return this.httpClient.get(url);
    }
    */
}
