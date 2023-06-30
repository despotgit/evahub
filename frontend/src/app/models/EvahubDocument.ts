import { EvahubDocumentTypeNumber } from "../common/constants";

export interface EvahubDocument {
    documentType: EvahubDocumentTypeNumber;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}
