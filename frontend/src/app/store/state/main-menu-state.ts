// MAIN MENU

import { EvahubMainMenuItem, getInitialMainMenuItems } from "src/app/common/constants";

export class MainMenuState {
    mainMenuItems: EvahubMainMenuItem[]; // can potentially be ommited of properties
}

export const INITIAL_MAIN_MENU = {
    mainMenuItems: getInitialMainMenuItems()
};
