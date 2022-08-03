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

export const EvahubDocumentTypeDictionary = {
    log: EvahubDocumentType.EVAHUB_LOG,
    report: EvahubDocumentType.EVAHUB_REPORT,
    check: EvahubDocumentType.EVAHUB_CHECK
};

export const EvahubDocumentTypeStringDictionary = {
    log: "Log",
    report: "Report",
    check: "Check"
};
