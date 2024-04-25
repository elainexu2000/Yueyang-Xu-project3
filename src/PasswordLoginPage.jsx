import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from './NavBar';

function PasswordLoginPage() {
    const navigate = useNavigate()

    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState('');
  
    async function onSubmit() {
      setErrorMsgState('');
      try {
        await axios.post('/api/passwordUser/login', {
            username: usernameState,
            password: passwordState,
        });

        navigate('/password');
      } catch (error) {
          setErrorMsgState(error.response.data);
      }
    }
  
    function updatePassword(event) {
        setPasswordState(event.target.value);
    }
  
    function updateUsername(event) {
        setUsernameState(event.target.value);
    }

    return (
      <div>
            <h1>Login Page</h1>
            <NavBar isAuthenticated={false} username={""} />
          {errorMsgState && <h1>
              {errorMsgState}
          </h1>}

          <div>
              <div>
                  <label>Username:</label> <input value={usernameState} onInput={(event) => updateUsername(event)}/>
              </div>
              <div>
                  <label>Password:</label> <input value={passwordState} onInput={(event) => updatePassword(event)}/>
              </div>
              <div>
                  <button onClick={() => onSubmit()}>Submit</button>
              </div>
          </div>
      </div>
    )
  }
  
  export default PasswordLoginPage;
  