import { Action, createAction, props } from "@ngrx/store";

export const DELETE_DOCUMENT = "[Documents Page] delete a document";
export const UPLOAD_NEW_DOCUMENT = "[Upload Page] upload new document";

export type DocumentActions = typeof DeleteDocument | typeof UploadNewDocument;

export const DeleteDocument = createAction(DELETE_DOCUMENT, props<{ id: string }>());

export const UploadNewDocument = createAction(UPLOAD_NEW_DOCUMENT, props<{ id: string }>());
