import { environment } from "src/environments/environment";

export const EVAHUB_DOCUMENT_TYPE_UNKNOWN = 0;
export const EVAHUB_DOCUMENT_TYPE_LOG = 1;
export const EVAHUB_DOCUMENT_TYPE_REPORT = 2;
export const EVAHUB_DOCUMENT_TYPE_CHECK = 3;

export enum EvahubDocumentTypeWordToNumber {
    unknown = EVAHUB_DOCUMENT_TYPE_UNKNOWN,
    log = EVAHUB_DOCUMENT_TYPE_LOG,
    report = EVAHUB_DOCUMENT_TYPE_REPORT,
    check = EVAHUB_DOCUMENT_TYPE_CHECK
}

export function getDocumentTypeAsStringFromNumber(numberedDT: number) {
    return Object.keys(EvahubDocumentTypeWordToNumber).find(
        dt => numberedDT == EvahubDocumentTypeWordToNumber[dt]
    );
}

export function getDocumentTypeAsNumberFromString(dt: string) {
    return EvahubDocumentTypeWordToNumber[dt.toLowerCase()];
}

export const storedObjectName = "evahubJwt";

export const loginTokenExpiryTime = 60; // In minutes

export const enum PageIndexEnum {
    NONE_PAGE = 0,
    REGISTER_PAGE = 1,
    LOGIN_PAGE = 2,
    HOME_PAGE = 3,
    USER_FILE_UPLOAD_PAGE = 4,
    LOGS_PAGE = 5,
    REPORTS_PAGE = 6,
    CHECKS_PAGE = 7
}

// Main page dictionary, page data is:
// handle, index, isDocumentsPage, label
export const PageIndexDictionary = {
    none: {
        pageIndex: PageIndexEnum.NONE_PAGE,
        isDocumentsPage: false,
        label: "None",
        gotoParam: "",
        isInMainMenu: false
    },
    register: {
        pageIndex: PageIndexEnum.REGISTER_PAGE,
        isDocumentsPage: false,
        label: "Register",
        gotoParam: "register",
        isInMainMenu: false
    },
    login: {
        pageIndex: PageIndexEnum.LOGIN_PAGE,
        isDocumentsPage: false,
        label: "Login",
        gotoParam: "login",
        isInMainMenu: false
    },
    home: {
        pageIndex: PageIndexEnum.HOME_PAGE,
        isDocumentsPage: false,
        label: "Home",
        gotoParam: "home",
        isInMainMenu: false
    },
    "user-file-upload": {
        pageIndex: PageIndexEnum.USER_FILE_UPLOAD_PAGE,
        isDocumentsPage: false,
        label: "Upload",
        gotoParam: "user-file-upload",
        isInMainMenu: true
    },
    log: {
        pageIndex: PageIndexEnum.LOGS_PAGE,
        isDocumentsPage: true,
        label: "Logs",
        gotoParam: "log",
        isInMainMenu: true
    },
    report: {
        pageIndex: PageIndexEnum.REPORTS_PAGE,
        isDocumentsPage: true,
        label: "Report check",
        gotoParam: "report",
        isInMainMenu: true
    },
    check: {
        pageIndex: PageIndexEnum.CHECKS_PAGE,
        isDocumentsPage: true,
        label: "Order report",
        gotoParam: "check",
        isInMainMenu: true
    }
};

export function getPageNameFromPageIndex(i: number): string {
    return Object.keys(PageIndexDictionary).find(k => PageIndexDictionary[k].pageIndex == i);
}

export class EvahubMainMenuItem {
    constructor(
        public label: string,
        public gotoParam: string,
        public isDocumentsPage: boolean,
        public isSelected: boolean,
        public pageIndex: PageIndexEnum
    ) {}
}

export function getInitialMainMenuItems() {
    let toRet: EvahubMainMenuItem[] = [];
    Object.keys(PageIndexDictionary).forEach(k => {
        let immi = PageIndexDictionary[k];
        if (immi.isInMainMenu) {
            immi.isSelected = false;
            toRet.push(immi);
        }
    });

    return toRet;
}

export function getAllEvahubDocumentTypes() {
    return {
        1: "a",
        2: "b"
    };
}

/*
    Will change the words:
    "cAMEL", "CAMEL", "camel", "cAmEl", "CaMeL"
    to "Camel"
*/
export function capitalizeWord(word: string): string {
    word = word.toLowerCase();
    const flc = word.toUpperCase().substring(0, 1); // First Letter Capitalized
    const sc = flc + word.substring(1, word.length); // Capitalized word

    return sc;
}

export function getRegisterUrl() {
    let url = environment.baseApiBackendUrl + "/auth/register";
    console.log("url is: ", url);
    return url;
}

export function getLoginUrl() {
    let url = environment.baseApiBackendUrl + "/auth/login";
    console.log("url is: ", url);
    return url;
}

export function doesMaterialFormHaveErrors(mf: any) {
    //console.log("mf is:", mf);
    //export function doesMaterialFormHaveErrors(mf: FormGroup) {
    let keys = Object.keys(mf.controls);
    for (let i = 0; i < keys.length; i++) {
        let prop = mf.controls[keys[i]];
        if (prop.errors) {
            return true;
        }
    }

    return false;
}

export class EvahubSidenavMenuItem {
    id: number;
    label?: string;
    action?: string;
    selected: boolean;
}
