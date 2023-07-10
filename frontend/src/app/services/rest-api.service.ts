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

    deleteDocument(documentId: number, username: string, documentType: string) {
        let url = `${environment.baseApiBackendUrl}/rest/delete/document/id/${documentId}/username/${username}/document-type/${documentType}`;

        return this.httpClient.delete(url);
    }
}
