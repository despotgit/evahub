import { EVAHUB_DOCUMENT_TYPE_REPORT } from "../common/constants";
import { EvahubDocument } from "./EvahubDocument";

// REPORTS:
export class Report implements EvahubDocument {
    reportId?: number;
    reportName?: string;
    reportContent?: string;

    documentType: number = EVAHUB_DOCUMENT_TYPE_REPORT;

    getDocumentId() {
        return this.reportId;
    }

    getDocumentName() {
        return this.reportName;
    }

    getDocumentContent() {
        return JSON.stringify(this.reportContent);
    }
}
