import { Action } from "@ngrx/store";

export const DELETE_DOCUMENT = "[Documents Page] delete a document";
export const UPLOAD_NEW_DOCUMENT = "[Upload Page] upload new document";

export type DocumentActions = DeleteDocument | UploadeNewDocument;

export class DeleteDocument implements Action {
    readonly type: string = DELETE_DOCUMENT;
    constructor(public payload: any) {
        //
    }
}

export class UploadeNewDocument implements Action {
    readonly type: string = UPLOAD_NEW_DOCUMENT;
}
