import { environment } from "src/environments/environment";

export function registerUrl() {
    let url = environment.baseApiBackendUrl + "/auth/register";
    //console.log("url is: ", url);
    return url;
}

export function loginUrl() {
    let url = environment.baseApiBackendUrl + "/auth/login";
    //console.log("url is: ", url);
    return url;
}

export function formPutNewLogUrl(username = "") {
    return `${environment.baseApiBackendUrl}/rest/put/document/document-type/log/username/${username}`;
}

export function formPostNewProjectUrl(username = "") {
    let url = `${environment.baseApiBackendUrl}/rest/post/document/document-type/project/username/${username}`;
    //console.log("url is: ", url);
    return url;
}
