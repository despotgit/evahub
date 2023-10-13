// EVAHUB DOCUMENT CONTENT

export interface DocumentContentState {
    shouldDisplaySpinner: boolean;
    isInDocumentUploadMode: boolean;
    isInNewProjectCreationMode: boolean;
    isInNewReportTemplateMode: boolean;
    isEmptyDocumentPage: boolean;
}

export const INITIAL_DOCUMENT_CONTENT_STATE = {
    shouldDisplaySpinner: false,
    isInDocumentUploadMode: false,
    isInNewProjectCreationMode: false,
    isInNewReportTemplateMode: false,
    isEmptyDocumentPage: false
};
