// SIDENAV

import { EvahubSidenavMenuItem } from "src/app/common/constants";

export interface SidenavState {
    isSidenavOpened: boolean;
    sidenavMenuItems: EvahubSidenavMenuItem[];
    shouldDisplaySidenavSpinner: boolean;
}

export const INITIAL_SIDENAV_STATE = {
    isSidenavOpened: false,
    sidenavMenuItems: [],
    shouldDisplaySidenavSpinner: false
};
