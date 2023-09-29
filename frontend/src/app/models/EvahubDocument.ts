import { EvahubDocumentTypeWordToNumber } from "../common/constants";

export interface EvahubDocument {
    documentType: EvahubDocumentTypeWordToNumber;

    projectLogIds?: number[];
    projectName?: string;
    projectDescription?: string;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}
