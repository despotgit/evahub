// REGISTER PAGE

export interface RegisterPageDataState {
    registerUsername: string;
    registerPassword: string;
    registerPasswordConfirmation: string;
    firstLastName: string;
    email: string;
}

export const INITIAL_REGISTER_PAGE_STATE = {
    registerUsername: "",
    registerPassword: "",
    registerPasswordConfirmation: "",
    firstLastName: "",
    email: ""
};
