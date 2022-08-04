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

export const PageIndexDictionary = {
    none: PageIndex.NONE_PAGE,
    login: PageIndex.LOGIN_PAGE,
    home: PageIndex.HOME_PAGE,
    user_file_upload: PageIndex.USER_FILE_UPLOAD_PAGE,
    log: PageIndex.LOGS_PAGE,
    report: PageIndex.REPORTS_PAGE,
    check: PageIndex.CHECKS_PAGE
};

export function getPageNameFromPageIndex(i) {
    let res = "x";
    Object.keys(PageIndexDictionary).forEach(k => {
        if (PageIndexDictionary[k] == i) {
            res = k;
        }
    });

    return res;
}

export class MainMenuItem {
    label: string;
    gotoParam: string;
    isDocumentsPage: boolean;
    isSelected: boolean;
    pageIndex: PageIndex;
}

export const INITIAL_MAIN_MENU_ITEMS = [
    {
        label: "Home",
        gotoParam: "Home",
        isDocumentsPage: false,
        isSelected: false,
        pageIndex: PageIndex.HOME_PAGE
    },
    {
        label: "Upload",
        gotoParam: "Upload",
        isDocumentsPage: false,
        isSelected: false,
        pageIndex: PageIndex.USER_FILE_UPLOAD_PAGE
    },
    {
        label: "Logs",
        gotoParam: "Log",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.LOGS_PAGE
    },
    {
        label: "Reports",
        gotoParam: "Report",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.REPORTS_PAGE
    },
    {
        label: "Checks",
        gotoParam: "Check",
        isDocumentsPage: true,
        isSelected: false,
        pageIndex: PageIndex.CHECKS_PAGE
    }
];
