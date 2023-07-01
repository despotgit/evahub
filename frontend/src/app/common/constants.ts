import { environment } from "src/environments/environment";

export const EVAHUB_DOCUMENT_TYPE_LOG = 1;
export const EVAHUB_DOCUMENT_TYPE_REPORT = 2;
export const EVAHUB_DOCUMENT_TYPE_CHECK = 3;

export const enum EvahubDocumentTypeAsString {
    EVAHUB_DOCUMENT_TYPE_LOG = "Log",
    EVAHUB_DOCUMENT_TYPE_REPORT = "Report",
    EVAHUB_DOCUMENT_TYPE_CHECK = "Check"
}

export const EvahubDocumentTypeWordToNumber = {
    log: EVAHUB_DOCUMENT_TYPE_LOG,
    report: EVAHUB_DOCUMENT_TYPE_REPORT,
    check: EVAHUB_DOCUMENT_TYPE_CHECK
};

export function getDocumentTypeAsStringFromNumber(numberedDT: number) {
    return Object.keys(EvahubDocumentTypeWordToNumber).filter(
        dt => numberedDT == EvahubDocumentTypeWordToNumber[dt]
    );
}

export const EvahubDocumentTypeStringArray = ["log", "report", "check"];

export const storedObjectName = "evahubJwt";

export const loginTokenExpiryTime = 60; // In minutes

export const enum PageIndex {
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
        index: PageIndex.NONE_PAGE,
        isDocumentsPage: false,
        label: "None",
        gotoParam: "",
        isInMainMenu: false
    },
    register: {
        index: PageIndex.REGISTER_PAGE,
        isDocumentsPage: false,
        label: "Register",
        gotoParam: "register",
        isInMainMenu: false
    },
    login: {
        index: PageIndex.LOGIN_PAGE,
        isDocumentsPage: false,
        label: "Login",
        gotoParam: "login",
        isInMainMenu: false
    },
    home: {
        index: PageIndex.HOME_PAGE,
        isDocumentsPage: false,
        label: "Home",
        gotoParam: "home",
        isInMainMenu: false
    },
    "user-file-upload": {
        index: PageIndex.USER_FILE_UPLOAD_PAGE,
        isDocumentsPage: false,
        label: "Upload",
        gotoParam: "user-file-upload",
        isInMainMenu: true
    },
    log: {
        index: PageIndex.LOGS_PAGE,
        isDocumentsPage: true,
        label: "Logs",
        gotoParam: "log",
        isInMainMenu: true
    },
    report: {
        index: PageIndex.REPORTS_PAGE,
        isDocumentsPage: true,
        label: "Reports",
        gotoParam: "report",
        isInMainMenu: true
    },
    check: {
        index: PageIndex.CHECKS_PAGE,
        isDocumentsPage: true,
        label: "Checks",
        gotoParam: "check",
        isInMainMenu: true
    }
};

export function getPageNameFromPageIndex(i) {
    let res = "x";
    Object.keys(PageIndexDictionary).forEach(k => {
        if (PageIndexDictionary[k].index == i) {
            res = k;
        }
    });

    return res;
}

export class EvahubMainMenuItem {
    constructor(
        public label: string,
        public gotoParam: string,
        public isDocumentsPage: boolean,
        public isSelected: boolean,
        public index: PageIndex
    ) {
        this.label = label; // DEV:  check later, if needed at all
    }
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

export function capitalizeDocumentType(word: EvahubDocumentTypeAsString): string {
    let res: EvahubGrammar = EvahubDocumentTypeGrammar[word];
    return res.singularNameCapitalized;
}

export function capitalizeWord(word: string): string {
    const flc = word.toUpperCase().substring(0, 1); // First Letter Capitalized
    const sc = flc + word.substring(1, word.length); // Capitalized word

    return sc;
}

export function getRegisterUrl() {
    let url = environment.baseApiBackendUrl + "/auth/register";
    console.log("url is: ", url);
    //let base = environment.baseApiBackendUrl + '/register/user'
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

export const enum EvahubDocumentTypeNumber {
    EVAHUB_DOCUMENT_TYPE_LOG,
    EVAHUB_DOCUMENT_TYPE_REPORT,
    EVAHUB_DOCUMENT_TYPE_CHECK
}

export class EvahubDocumentTypeGrammar {
    static readonly LOG: EvahubGrammar = {
        singularNameCapitalized: "Log",
        pluralNameCapitalized: "Logs",
        singularNameMiniscule: "log",
        pluralNameMiniscule: "logs",
        numberConstant: EVAHUB_DOCUMENT_TYPE_LOG
    };

    static readonly REPORT: EvahubGrammar = {
        singularNameCapitalized: "Report",
        pluralNameCapitalized: "Reports",
        singularNameMiniscule: "report",
        pluralNameMiniscule: "reports",
        numberConstant: EVAHUB_DOCUMENT_TYPE_REPORT
    };

    static readonly CHECK: EvahubGrammar = {
        singularNameCapitalized: "Check",
        pluralNameCapitalized: "Checks",
        singularNameMiniscule: "check",
        pluralNameMiniscule: "checks",
        numberConstant: EVAHUB_DOCUMENT_TYPE_CHECK
    };

    //static allTypes = Array(3);

    static allTypes = [
        EVAHUB_DOCUMENT_TYPE_LOG => EvahubDocumentTypeGrammar.LOG,
        EVAHUB_DOCUMENT_TYPE_REPORT => EvahubDocumentTypeGrammar.REPORT,
        EVAHUB_DOCUMENT_TYPE_CHECK => EvahubDocumentTypeGrammar.CHECK
    ];
}

export class EvahubGrammar {
    singularNameCapitalized: string;
    pluralNameCapitalized: string;
    singularNameMiniscule: string;
    pluralNameMiniscule: string;
    numberConstant: number;
}

export class EvahubSidenavMenuItem {
    id: number;
    label?: string;
    action?: string;
    selected: boolean;
}
