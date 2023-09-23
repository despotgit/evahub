import { EVAHUB_DOCUMENT_TYPE_PROJECT } from "../common/constants";
import { EvahubDocument } from "./EvahubDocument";

// LOGS:
export class Project implements EvahubDocument {
    projectId?: number;
    projectName?: string = "";
    projectContent?: string = "";

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
}
