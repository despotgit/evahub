import { EvahubMainMenuItem, PageIndex, getInitialMainMenuItems } from "../common/constants";
import { Check } from "../models/Check";
import { Log } from "../models/Log";
import { Report } from "../models/Report";

export interface ApplicationState {
    currentUser: UserState;
    registerPageData: RegisterPageDataState;
    documentContent: DocumentContentState;
    userLogs: UserLogsState;
    userReports: UserReportsState;
    userChecks: UserChecksState;
    sidenav: SidenavState;
    mainMenu: MainMenuState;
}

// REGISTER PAGE

export interface RegisterPageDataState {
    registerUsername: string;
    registerPassword: string;
    registerPasswordConfirmation: string;
    firstLastName: string;
    email: string;
}

export const INITIAL_REGISTER_PAGE_STATE = {
    registerUsername: "",
    registerPassword: "",
    registerPasswordConfirmation: "",
    firstLastName: "",
    email: ""
};

// EVAHUB DOCUMENT CONTENT

export interface DocumentContentState {
    shouldDisplaySpinner: boolean;
}

export const INITIAL_DOCUMENT_CONTENT_STATE = {
    shouldDisplaySpinner: false
};

// SIDENAV

export class EvahubSidenavMenuItem {
    id: number;
    label?: string;
    action?: string;
    selected: boolean;
}

export interface SidenavState {
    isSidenavOpened: boolean;
    sidenavMenuItems: EvahubSidenavMenuItem[];
}

export const INITIAL_SIDENAV_STATE = {
    isSidenavOpened: false,
    sidenavMenuItems: []
};

export class UserReportsState {
    userReports: Report[];
    selectedUserReport: Report;
}

export const INITIAL_USER_REPORTS_STATE = {
    userReports: [],
    selectedUserReport: new Report()
};

export class UserChecksState {
    userChecks: Check[];
    selectedUserCheck: Check;
}

export const INITIAL_USER_CHECKS_STATE = {
    userChecks: [],
    selectedUserCheck: new Check()
};

export class UserLogsState {
    userLogs: Log[];
    selectedUserLog: Log;
}

export const INITIAL_USER_LOGS_STATE = {
    userLogs: [],
    selectedUserLog: new Log()
};

// MAIN MENU
export class MainMenuState {
    mainMenuItems: EvahubMainMenuItem[];
}

export const INITIAL_MAIN_MENU = {
    mainMenuItems: getInitialMainMenuItems()
};

// USER

export interface UserState {
    username: string;
    isLoggedIn: boolean;
    currentPageIndex: PageIndex;
    currentDocumentId: number;
}

export const INITIAL_USER_STATE = {
    username: "",
    isLoggedIn: false,
    currentPageIndex: PageIndex.NONE_PAGE,
    currentDocumentId: 0
};

// APP STATE:

export const INITIAL_APPLICATION_STATE = {
    currentUser: INITIAL_USER_STATE,
    registerPageData: INITIAL_REGISTER_PAGE_STATE,
    documentContent: INITIAL_DOCUMENT_CONTENT_STATE,
    userLogs: INITIAL_USER_LOGS_STATE,
    userReports: INITIAL_USER_REPORTS_STATE,
    userChecks: INITIAL_USER_CHECKS_STATE,
    sidenav: INITIAL_SIDENAV_STATE,
    mainMenu: INITIAL_MAIN_MENU
};
