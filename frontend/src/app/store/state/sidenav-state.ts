// SIDENAV

import { EvahubSidenavMenuItem } from "src/app/common/constants";

export interface SidenavState {
    isSidenavOpened: boolean;
    sidenavMenuItems: EvahubSidenavMenuItem[];
}

export const INITIAL_SIDENAV_STATE = {
    isSidenavOpened: false,
    sidenavMenuItems: []
};
