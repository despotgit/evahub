import { EvahubDocumentType } from "./EvahubDocument";

// CHECKS:
export class Check {
    checkUserId?: number;
    checkId?: number;
    checkName?: string;
    checkContent?: string;

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_CHECK;

    getDocumentId() {
        return this.checkId;
    }

    getDocumentName() {
        return this.checkName;
    }

    getDocumentContent() {
        return this.checkContent;
    }
}
