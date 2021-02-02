import { combineReducers } from 'redux';
import { clearState } from '../localStorage';

// Reducer Example

const songsReducer = () => {
    return [
        {title:'No Scrubs', duration:'4:05'},
        {title:'Macarena', duration:'2:30'}
    ];
};

const selectedSongReducer = (selectedSong=null, action) => {
    if (action.type === 'SONG_SELECTED') {
        return action.payload;
    }

    return selectedSong;
};

const userLoginReducer = (token=null, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return action.payload;
        case 'USER_LOGOUT':
            clearState();
            return action.payload;
        default:
            return token       
    }
};

const loginFormReducer = (loginSubmitted=false, action) => {
    switch (action.type) {
        case 'LOGIN_SUBMITTED':
            return action.payload;
        case 'USER_LOGOUT':
            return false;
        default:
            return loginSubmitted;   
    }
};


export default combineReducers({
    songs: songsReducer,
    selectedSong: selectedSongReducer,
    token: userLoginReducer,
    loginSubmitted: loginFormReducer
});