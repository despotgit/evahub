import { EvahubDocument, EvahubDocumentType } from "./EvahubDocument";

// LOGS:
export class Log implements EvahubDocument {
    logId?: number;
    logName?: string = "";
    logContent?: string = "";

    documentType: EvahubDocumentType = EvahubDocumentType.EVAHUB_LOG;

    getDocumentId() {
        return this.logId;
    }

    getDocumentName() {
        return this.logName;
    }

    getDocumentContent() {
        return this.logContent;
    }
}
