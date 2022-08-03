export const storedObjectName = "powerJwt";

export const loginTokenExpiryTime = 60; // In minutes

export const enum PageIndex {
    NONE_PAGE = 0,
    LOGIN_PAGE = 1,
    HOME_PAGE = 2,
    LOGS_PAGE = 3,
    REPORTS_PAGE = 4,
    CHECKS_PAGE = 5
}

export const PageIndexDictionary = {
    none: PageIndex.NONE_PAGE,
    login: PageIndex.LOGIN_PAGE,
    home: PageIndex.HOME_PAGE,
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
