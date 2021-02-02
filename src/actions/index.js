// Action Creator Example

export const selectSong = song => {
    return {
        type: 'SONG_SELECTED',
        payload: song
    };
};

export const fetchExample = () => async (dispatch) => {
    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Authorization': ''
        }
    });

    dispatch({ type: 'FETCH_EXAMPLE', payload: response.data});
};

export const submitLogin = () => {
    return {
        type: 'LOGIN_SUBMITTED',
        payload: true
    };
};

export const userLogin = (creds) => async (dispatch) => {
    let credString = btoa(creds.username+':'+creds.password)
    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credString}`
        }
    }).then(res => res.json());

    console.log(response);

    dispatch({ type: 'USER_LOGIN', payload: response.access_token});
};

export const userLogout = () => {
    return {
        type: 'USER_LOGOUT',
        payload: null
    }
}


