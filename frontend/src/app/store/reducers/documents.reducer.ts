// Generic update
export function updateState(store, sliceName, propertyName, newValue) {
    let toApply = reducer(store, sliceName, propertyName, newValue);
    store.patchState(toApply);
}

// Generic reducer by Vladimir Despotovic
export function reducer(store, sliceName, propertyName, newValue) {
    const oldStateSlice = store.get(state => state[sliceName]);
    const newStateSlice = { ...oldStateSlice }; // deep copy
    newStateSlice[propertyName] = newValue;
    const toApply = {};
    toApply[sliceName] = newStateSlice;
    return toApply;
}
