import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root"
})
export class BraintreeService {
    constructor(private httpClient: HttpClient) {}

    getBraintreeToken() {
        let url = `${environment.baseApiBackendUrl}/braintree/get-token`;
        return this.httpClient.get(url);
    }
}
