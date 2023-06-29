// Generic update
import { createReducer, on } from "@ngrx/store";
import { INITIAL_APPLICATION_STATE } from "../application.state";
import { GenericAction } from "../actions/generic.actions";
import { DeleteDocument } from "../actions/documents.actions";

export const documentsReducer = createReducer(
    INITIAL_APPLICATION_STATE,
    on(DeleteDocument, (state, documentId) => {
        let sidenav = { ...state.sidenav };

        sidenav.sidenavMenuItems = sidenav.sidenavMenuItems.filter(sdmi => {
            //let sdmiId = sdmi.id ? sdmi.id : 0;
            //return sdmiId != documentId;
            return sdmi.id != documentId;
        });

        return { ...state, sidenav };
    })
);
