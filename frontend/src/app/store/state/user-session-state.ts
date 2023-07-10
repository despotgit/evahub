// USER

import {
    EVAHUB_DOCUMENT_TYPE_LOG,
    EvahubDocumentTypeWordToNumber,
    PageIndexEnum
} from "src/app/common/constants";

export interface UserSessionState {
    username: string;
    isLoggedIn: boolean;
    currentPageIndex: PageIndexEnum;
    currentDocumentId: number;
    currentDocumentType: EvahubDocumentTypeWordToNumber;
}

export const INITIAL_USER_SESSION_STATE = {
    username: "",
    isLoggedIn: false,
    currentPageIndex: PageIndexEnum.NONE_PAGE,
    currentDocumentId: 0,
    currentDocumentType: EVAHUB_DOCUMENT_TYPE_LOG
};
