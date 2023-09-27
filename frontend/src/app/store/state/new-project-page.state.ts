import { Log } from "src/app/models/Log";

export interface NewProjectPageState {
    selectedLogs: Log[];
    description: string;
    name: string;
}

export const INITIAL_NEW_PROJECT_PAGE_STATE = {
    selectedLogs: [],
    description: "",
    name: ""
};
