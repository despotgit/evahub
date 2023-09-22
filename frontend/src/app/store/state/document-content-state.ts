// EVAHUB DOCUMENT CONTENT

export interface DocumentContentState {
    shouldDisplaySpinner: boolean;
    isInDocumentUploadMode: boolean;
}

export const INITIAL_DOCUMENT_CONTENT_STATE = {
    shouldDisplaySpinner: false,
    isInDocumentUploadMode: false
};
