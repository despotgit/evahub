import {
    EvahubMainMenuItem,
    EvahubSidenavMenuItem,
    PageIndex,
    getInitialMainMenuItems
} from "../common/constants";
import { Check } from "../models/Check";
import { Log } from "../models/Log";
import { Report } from "../models/Report";

export interface ApplicationState {
    currentUser: UserState;
    registerPageData: RegisterPageDataState;
    documentContent: DocumentContentState;
    userLogs: Array<Log>;
    userReports: Array<Report>;
    userChecks: Array<Check>;
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

export interface SidenavState {
    isSidenavOpened: boolean;
    sidenavMenuItems: EvahubSidenavMenuItem[];
}

export const INITIAL_SIDENAV_STATE = {
    isSidenavOpened: false,
    sidenavMenuItems: []
};

export const UserLogsState: Array<Log> = [];
export const UserReportsState: Array<Report> = [];
export const UserChecksState: Array<Check> = [];

// MAIN MENU
export class MainMenuState {
    mainMenuItems: EvahubMainMenuItem[]; // can potentially be ommited of properties
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
    userLogs: [],
    userReports: [],
    userChecks: [],
    sidenav: INITIAL_SIDENAV_STATE,
    mainMenu: INITIAL_MAIN_MENU
};
