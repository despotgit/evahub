import { EVAHUB_DOCUMENT_TYPE_PROJECT } from "../common/constants";
import { EvahubDocument } from "./EvahubDocument";

// LOGS:
export class Project implements EvahubDocument {
    projectId?: number; // id from the DB
    projectName: string = "";
    projectContent?: string = "";
    projectLogIds: number[] = []; // id-s of the participating logs

    documentType: number = EVAHUB_DOCUMENT_TYPE_PROJECT;

    getDocumentId() {
        return this.projectId;
    }

    getDocumentName() {
        return this.projectName;
    }

    getDocumentContent() {
        return this.projectContent;
    }

    getProjectLogs() {
        return this.projectLogIds;
    }
}
