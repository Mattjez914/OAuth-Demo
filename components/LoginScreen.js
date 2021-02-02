import React, {useState} from 'react';
import { connect } from 'react-redux';
import { userLogin, submitLogin } from '../actions';


const errorText = {
    color: 'red'
}

const LoginScreen = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLoginSubmit = (event) => {
        // console.log(event)
        event.preventDefault();
        props.submitLogin();
        props.userLogin({username,password});
        // console.log(username,password);
    }

    const errorMessage = () => {
        if (props.error === 401) {
            return (
                <div style={errorText}>
                    Username and password combination not recognized. Please try again.
                </div>
            )
        }
        return
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Login</h5>
                <form>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {errorMessage()}
                  </div>
                  <button type="submit" className="btn btn-primary" onClick={(e) => onLoginSubmit(e)}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default connect(null, {userLogin, submitLogin})(LoginScreen);