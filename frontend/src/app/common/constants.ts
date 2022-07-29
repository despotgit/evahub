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
    logs: PageIndex.LOGS_PAGE,
    reports: PageIndex.REPORTS_PAGE,
    checks: PageIndex.CHECKS_PAGE
};
