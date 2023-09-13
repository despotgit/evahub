import { EvahubDocumentTypeWordToNumber } from "../common/constants";

export interface EvahubDocument {
    documentType: EvahubDocumentTypeWordToNumber;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}
