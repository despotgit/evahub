import { Action, createAction } from "@ngrx/store";

export const GENERIC_ACTION = "[Anywhere] some action description";

export const GenericAction = createAction(GENERIC_ACTION);
