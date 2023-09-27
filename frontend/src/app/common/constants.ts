import { environment } from "src/environments/environment";

export const EVAHUB_DOCUMENT_TYPE_UNKNOWN = 0;
export const EVAHUB_DOCUMENT_TYPE_PROJECT = 1;
export const EVAHUB_DOCUMENT_TYPE_LOG = 2;
export const EVAHUB_DOCUMENT_TYPE_REPORT = 3;
export const EVAHUB_DOCUMENT_TYPE_CHECK = 4;

export enum EvahubDocumentTypeWordToNumber {
    unknown = EVAHUB_DOCUMENT_TYPE_UNKNOWN,
    project = EVAHUB_DOCUMENT_TYPE_PROJECT,
    log = EVAHUB_DOCUMENT_TYPE_LOG,
    report = EVAHUB_DOCUMENT_TYPE_REPORT,
    check = EVAHUB_DOCUMENT_TYPE_CHECK
}

export const storedObjectName = "evahubJwt";

export const loginTokenExpiryTime = 60; // In minutes

export const enum PageIndexEnum {
    NONE_PAGE = 0,
    REGISTER_PAGE = 1,
    LOGIN_PAGE = 2,
    HOME_PAGE = 3,
    PROJECTS_PAGE = 4,
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
    project: {
        pageIndex: PageIndexEnum.PROJECTS_PAGE,
        isDocumentsPage: true,
        label: "Projects",
        gotoParam: "project",
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

export class EvahubMainMenuItem {
    constructor(
        public label: string,
        public gotoParam: string,
        public isDocumentsPage: boolean,
        public isSelected: boolean,
        public pageIndex: PageIndexEnum
    ) {}
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
