// state.js
let appState = {
    user: null,
    currentFeed: [],
    loading: false,
};

function setAppState(newState){
    appState = { ...appState, ...newState};
    console.log('State updated:', appState);
    return appState;
}

function getAppState(){
   return appState;
}

export { setAppState, getAppState };