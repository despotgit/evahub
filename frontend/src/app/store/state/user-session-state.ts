// USER

import { PageIndex } from "src/app/common/constants";

export interface UserSessionState {
    username: string;
    isLoggedIn: boolean;
    currentPageIndex: PageIndex;
    currentDocumentId: number;
}

export const INITIAL_USER_SESSION_STATE = {
    username: "",
    isLoggedIn: false,
    currentPageIndex: PageIndex.NONE_PAGE,
    currentDocumentId: 0
};
