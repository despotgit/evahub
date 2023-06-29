export function updateState(store, sliceName, propertyName, newValue) {
    let toApply = genericStateUpdaterFunction(store, sliceName, propertyName, newValue);
    store.patchState(toApply);
}

// genericReducerFunction by Vladimir Despotovic
export function genericStateUpdaterFunction(store, sliceName, propertyName, newValue) {
    const oldStateSlice = store.get(state => state[sliceName]);
    const newStateSlice = { ...oldStateSlice }; // deep copy
    newStateSlice[propertyName] = newValue;
    const toApply = {};
    toApply[sliceName] = newStateSlice;
    return toApply;
}
