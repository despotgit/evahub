import {
    EVAHUB_DOCUMENT_TYPE_LOG,
    EVAHUB_DOCUMENT_TYPE_REPORT,
    EVAHUB_DOCUMENT_TYPE_CHECK
} from "../../app/common/constants";

export class EvahubDocumentTypeGrammar {
    static readonly LOG: EvahubGrammar = {
        singularNameCapitalized: "Log",
        pluralNameCapitalized: "Logs",
        singularNameMiniscule: "log",
        pluralNameMiniscule: "logs",
        numberConstant: EVAHUB_DOCUMENT_TYPE_LOG
    };

    static readonly REPORT: EvahubGrammar = {
        singularNameCapitalized: "Report",
        pluralNameCapitalized: "Reports",
        singularNameMiniscule: "report",
        pluralNameMiniscule: "reports",
        numberConstant: EVAHUB_DOCUMENT_TYPE_REPORT
    };

    static readonly CHECK: EvahubGrammar = {
        singularNameCapitalized: "Check",
        pluralNameCapitalized: "Checks",
        singularNameMiniscule: "check",
        pluralNameMiniscule: "checks",
        numberConstant: EVAHUB_DOCUMENT_TYPE_CHECK
    };

    //static allTypes = Array(3);

    static allTypes = [
        EVAHUB_DOCUMENT_TYPE_LOG => EvahubDocumentTypeGrammar.LOG,
        EVAHUB_DOCUMENT_TYPE_REPORT => EvahubDocumentTypeGrammar.REPORT,
        EVAHUB_DOCUMENT_TYPE_CHECK => EvahubDocumentTypeGrammar.CHECK
    ];
}

export class EvahubGrammar {
    singularNameCapitalized: string;
    pluralNameCapitalized: string;
    singularNameMiniscule: string;
    pluralNameMiniscule: string;
    numberConstant: number;
}
