import { EVAHUB_DOCUMENT_TYPE_CHECK } from "../common/constants";

// CHECKS:
export class Check {
    checkId?: number;
    checkName?: string;
    checkContent?: string;

    documentType: number = EVAHUB_DOCUMENT_TYPE_CHECK;

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
