import { useState } from "react";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "../styles/AuthContent.css";

export default function LoginForm() {

    let history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(true);


    const handleLogin = (event) => {
        event.preventDefault();

        fetch('http://localhost:8000/login', {
            method: 'POST',
            cors: 'CORS',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: email, password: password}),
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            return response.json();
        })
        .then(response => {
            localStorage.setItem('token', response.token);

            let decoded = jwt_decode(response.token);
            console.log(decoded);
            localStorage.setItem('user', decoded.username);
            findUserFirstName(decoded.username);            
        })
        .catch(error => {
            console.log('Error: ', error);
            setDisabled(!disabled);
            }
        );
    };

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const findUserFirstName = (username) => {

        fetch('http://localhost:8000/find-user-first-name', {
            method: 'POST',
            cors: 'CORS',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username}),
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Something went wrong: ${response.statusText}`);
            return response.json();
        })
        .then(response => {
            localStorage.setItem('user_first_name', response);
            history.push("/generator");
        })
        .catch(error => console.log('Error: ', error));
    };

    return (
        <div className="auth-content">
            <h2>Sign in</h2>                       
            <form className="auth-form" onSubmit={handleLogin}>                            
                <div className="form-field">
                    <fieldset>
                        <label htmlFor="user_email">Email address</label>
                        <input type="email" className="text-input" id="user_email" name="userEmailInput" value={email} onChange={handleEmail}/>
                    </fieldset>
                </div>
                <div className="form-field">
                    <fieldset>
                        <label htmlFor="user_password">Password</label>
                        <input type="password" className="text-input" id="user_password" name="userPasswordInput" value={password} onChange={handlePassword}/>
                    </fieldset>
                </div>
                <span disabled={disabled} className="error-msg">Invalid email or password</span>
                <button type="submit" className="form-btn">Sign In</button>                                                        
            </form>
        </div>
    )
}
