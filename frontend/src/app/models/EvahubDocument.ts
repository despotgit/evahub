export const enum EvahubDocumentType {
    EVAHUB_LOG = 1,
    EVAHUB_REPORT = 2,
    EVAHUB_CHECK = 3
}

export interface EvahubDocument {
    documentType: EvahubDocumentType;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}
