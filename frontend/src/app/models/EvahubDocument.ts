import { EvahubDocumentType } from "../common/constants";

export interface EvahubDocument {
    documentType: EvahubDocumentType;

    projectLogIds?: number[];
    projectName?: string;
    projectDescription?: string;

    getDocumentId();
    getDocumentName();
    getDocumentContent();
}
