export function updateState(store, sliceName, propertyName, newValue) {
    let toApply = genericStateUpdaterFunction(store, sliceName, propertyName, newValue);
    store.patchState(toApply);
}

// genericReducerFunction by Vladimir Despotovic
export function genericStateUpdaterFunction(store, sliceName, propertyName, newValue) {
    const oldStateSlice = store.get(state => state[sliceName]);
    let newStateSlice;
    if (propertyName == null) {
        // the slice doesn't have any properties, it is updated in its entirety
        newStateSlice = newValue;
    } else {
        newStateSlice = { ...oldStateSlice }; // deep copy the old lice to new slice
        newStateSlice[propertyName] = newValue;
    }
    const toApply = {};
    toApply[sliceName] = newStateSlice;
    return toApply;
}
