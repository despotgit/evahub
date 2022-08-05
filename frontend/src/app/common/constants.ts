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

// Main page dictionary
export const PageIndexDictionary = {
    none: { index: PageIndex.NONE_PAGE, isDocumentsPage: false },
    login: { index: PageIndex.LOGIN_PAGE, isDocumentsPage: false },
    home: { index: PageIndex.HOME_PAGE, isDocumentsPage: false },
    "user-file-upload": { index: PageIndex.USER_FILE_UPLOAD_PAGE, isDocumentsPage: false },
    log: { index: PageIndex.LOGS_PAGE, isDocumentsPage: true },
    report: { index: PageIndex.REPORTS_PAGE, isDocumentsPage: true },
    check: { index: PageIndex.CHECKS_PAGE, isDocumentsPage: true }
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
    label: string;
    gotoParam: string;
    isDocumentsPage: boolean;
    isSelected: boolean;
    pageIndex: PageIndex;
}

export const INITIAL_MAIN_MENU_ITEMS = [
    {
        label: "Home",
        gotoParam: "home",
        isDocumentsPage: false,
        isSelected: false,
        pageIndex: PageIndex.HOME_PAGE
    },
    {
        label: "Upload",
        gotoParam: "user-file-upload",
        isDocumentsPage: false,
        isSelected: false,
        pageIndex: PageIndex.USER_FILE_UPLOAD_PAGE
    },
    {
        label: "Logs",
        gotoParam: "log",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.LOGS_PAGE
    },
    {
        label: "Reports",
        gotoParam: "report",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.REPORTS_PAGE
    },
    {
        label: "Checks",
        gotoParam: "check",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.CHECKS_PAGE
    }
];
