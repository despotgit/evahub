import { EvahubDocument, EvahubDocumentType } from "./EvahubDocument";

// REPORTS:
export class Report implements EvahubDocument {
    reportId?: number;
    reportName?: string;
    reportContent?: string;

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_REPORT;

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
