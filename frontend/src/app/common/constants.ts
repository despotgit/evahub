export const storedObjectName = "powerJwt";

export const loginTokenExpiryTime = 60; // In minutes

export const enum PageIndex {
    NONE_PAGE = 0,
    LOGIN_PAGE = 1,
    HOME_PAGE = 2,
    USER_FILE_UPLOAD_PAGE = 3,
    LOGS_PAGE = 4,
    REPORTS_PAGE = 5,
    CHECKS_PAGE = 6
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
        this.label = label;
    }
}

export function getInitialMainMenuItems() {
    let toRet = [];
    Object.keys(PageIndexDictionary).forEach(k => {
        let immi = PageIndexDictionary[k];
        if (immi.isInMainMenu) {
            immi.isSelected = false;
            toRet.push(immi);
        }
    });

    return toRet;
}

export function capitalizeWord(word: string) {
    const flc = word.toUpperCase().substring(0, 1); // First Letter Capitalized
    const sc = flc + word.substring(1, word.length); // Capitalized word

    return sc;
}
