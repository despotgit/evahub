// USER

import { EVAHUB_DOCUMENT_TYPE_LOG, EvahubDocumentType, PageIndexEnum } from "src/app/common/constants";

export interface UserSessionState {
    username: string;
    email: string;
    isLoggedIn: boolean;
    currentPageIndex: PageIndexEnum;
    currentDocumentId: number;
    currentDocumentType: EvahubDocumentType;
}

export const INITIAL_USER_SESSION_STATE = {
    username: "",
    email: "",
    isLoggedIn: false,
    currentPageIndex: PageIndexEnum.NONE_PAGE,
    currentDocumentId: 0,
    currentDocumentType: EVAHUB_DOCUMENT_TYPE_LOG
};
