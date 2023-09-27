import { DocumentContentState, INITIAL_DOCUMENT_CONTENT_STATE } from "./document-content-state";
import { UserProjectsState, UserLogsState, UserReportsState, UserChecksState } from "./documents-state";
import { INITIAL_MAIN_MENU, MainMenuState } from "./main-menu-state";
import { INITIAL_NEW_PROJECT_PAGE_STATE, NewProjectPageState } from "./new-project-page.state";

import { INITIAL_REGISTER_PAGE_STATE, RegisterPageDataState } from "./register-page-state";
import { INITIAL_SIDENAV_STATE, SidenavState } from "./sidenav-state";
import { INITIAL_USER_SESSION_STATE, UserSessionState } from "./user-session-state";

export interface ApplicationState {
    currentUserSession: UserSessionState;
    registerPageData: RegisterPageDataState;
    documentContent: DocumentContentState;
    userProjects: UserProjectsState;
    userLogs: UserLogsState;
    userReports: UserReportsState;
    userChecks: UserChecksState;
    sidenav: SidenavState;
    mainMenu: MainMenuState;
    newProjectPage: NewProjectPageState;
}

// APP STATE:

export const INITIAL_APPLICATION_STATE = {
    currentUserSession: INITIAL_USER_SESSION_STATE,
    registerPageData: INITIAL_REGISTER_PAGE_STATE,
    documentContent: INITIAL_DOCUMENT_CONTENT_STATE,
    userProjects: [],
    userLogs: [],
    userReports: [],
    userChecks: [],
    sidenav: INITIAL_SIDENAV_STATE,
    mainMenu: INITIAL_MAIN_MENU,
    newProjectPage: INITIAL_NEW_PROJECT_PAGE_STATE
};
