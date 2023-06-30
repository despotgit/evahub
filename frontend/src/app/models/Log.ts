import { EVAHUB_DOCUMENT_TYPE_LOG } from "../common/constants";
import { EvahubDocument } from "./EvahubDocument";

// LOGS:
export class Log implements EvahubDocument {
    logId?: number;
    logName?: string = "";
    logContent?: string = "";

    documentType: number = EVAHUB_DOCUMENT_TYPE_LOG;

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
