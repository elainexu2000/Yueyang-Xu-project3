import axios from 'axios';
import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import NavBar from './NavBar';

function PasswordManagerPage(){
    const navigate = useNavigate();
    const [passwordListState, setPasswordListState] = useState([]);
    const [shareRequestListState, setShareRequestListState] = useState([]);
    const [sharedPasswordListState, setSharedPasswordListState] = useState([]);

    const [domainState, setDomainState] = useState('');
    const [providedPasswordState, setProvidedPasswordState] = useState('');
    const [alphabetState, setAlphabetState] = useState(false);
    const [numeralsState, setNumeralsState] = useState(false);
    const [symbolsState, setSymbolsState] = useState(false);
    const [lengthState, setLengthState] = useState('');

    const [errorMessageState, setErrorMessageState] = useState('');
    const [messageState, setMessageState] = useState('');

    const [editingState, setEditingState] = useState({
        isEditing: false,
        editingId: ''
      });
    
    const [username, setUsername] = useState('');
    const [shareUsername, setShareUsername] = useState('');
    
    function updateDomain(event){
        setDomainState(event.target.value);
    }

    function updateProvidedPassword(event){
        setProvidedPasswordState(event.target.value);
    }

    function updateLength(event){
        setLengthState(event.target.value);
    }

    function toggleCheckbox(event){
        const { name, checked } = event.target;
        switch (name) {
          case 'alphabet':
            setAlphabetState(checked);
            break;
          case 'numerals':
            setNumeralsState(checked);
            break;
          case 'symbols':
            setSymbolsState(checked);
            break;
          default:
            break;
        }
      };
    
    function updateShareUsername(event){
        setShareUsername(event.target.value);
    }

    async function getAllPassword(){
        try{
            const response = await axios.get('/api/password');
            setPasswordListState(response.data);
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
    }

    async function getAllShareRequests(){
        try{
            const response = await axios.get('/api/share/requests');
            setShareRequestListState(response.data);
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
    }

    async function getAllSharedPasswords(){
        try{
            const response = await axios.get('/api/share/passwords');
            console.log(response);
            setSharedPasswordListState(response.data);
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
    }
      
    async function deletePassword(passwordId){
        try{
            const response = await axios.delete('/api/password/' + passwordId);
            setMessageState("Password entry deleted successfully.");
            await getAllPassword();
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
    }
    
    function isValidLength(lengthState) {
        lengthState = lengthState.trim();
        if (lengthState === '') {
            return false;
        }
        if (!/^\d+$/.test(lengthState)) {
            return false;
        }
        const lengthValue = parseInt(lengthState, 10);
        if (lengthValue >= 4 && lengthValue <= 50) {
            return true;
        }
        return false;
    }

    function generatePassword(alphabetState, numeralsState, symbolsState, lengthState) {
        const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numerals = '0123456789';
        const symbols = '!@#$%^&*()_-+=[]{}|;:,.<>?';
    
        let availableCharacters = '';
        let password = '';
    
        if (alphabetState) 
            availableCharacters += alphabets;
        if (numeralsState) 
            availableCharacters += numerals;
        if (symbolsState) 
            availableCharacters += symbols;
        
        password += getRandomCharacter(alphabets); 
        password += getRandomCharacter(numerals); 
        password += getRandomCharacter(symbols);
    
        for (let i = password.length; i < lengthState; i++) 
            password += getRandomCharacter(availableCharacters);

        return shuffle(password);
    }
    
    function getRandomCharacter(characters) {
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    function shuffle(str) {
        let array = str.split('');
        let currentIndex = array.length;
        let temporaryValue, randomIndex;
      
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array.join(''); 
      }

    async function onSubmit(){
        setErrorMessageState("");
        setMessageState("");

        if(! domainState){
            setErrorMessageState("Please enter a non-empty domain.");
            setMessageState("");
            return;
        }
        if(! providedPasswordState){
            if(!alphabetState && !symbolsState && !numeralsState){
                setErrorMessageState("Please check at least one checkbox. ");
                setMessageState("");
                return;
            }
            else if(!isValidLength(lengthState)){
                setErrorMessageState("Please enter a valid length between 4 and 50 (inclusive). ");
                setMessageState("");
                return;
            } 
            const generatedPassword = generatePassword(alphabetState, numeralsState, symbolsState, lengthState);
            setProvidedPasswordState(generatedPassword);
            setMessageState("Generated password for domain " + domainState);
        }
        
        if(providedPasswordState){
            try{
                if(editingState.isEditing){
                    await axios.put('/api/password/' + editingState.editingId, 
                    {domain: domainState, password: providedPasswordState});
                    setMessageState("Password for domain " + domainState + " updated successfully! ");
                    setErrorMessageState("");
                }
                else{
                    await axios.post('/api/password/', { domain: domainState, password: providedPasswordState });
                    setMessageState("Password entry for domain " + domainState + " added successfully! ");
                }
                setDomainState('');
                setProvidedPasswordState('');
                setAlphabetState(false);
                setNumeralsState(false);
                setSymbolsState(false);
                setLengthState('');
    
                setEditingState({
                    isEditing: false,
                    editingId: ''
                });
                await getAllPassword();
            }
            catch(error){
                console.log(error);
                if (error.response && error.response.data) {
                    setErrorMessageState(error.response.data);
                } else {
                    setErrorMessageState("An error occurred while processing the request.");
                }
            }
        }
    }

    async function onSubmitShareRequest(){
        setErrorMessageState("");
        setMessageState("");
        try{
            await axios.post('/api/share/', { requesterUsername: username, recipientUsername: shareUsername });
            setMessageState("Share request sent successfully! ");
            setShareUsername('');
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
            setShareUsername('');
        }
    }
    
    async function setEditPassword(passwordId, passwordDomain, passwordPassword){
        setDomainState(passwordDomain);
        setProvidedPasswordState(passwordPassword);
        setEditingState({
          isEditing: true,
          editingId: passwordId
        });
      }

    function onClearPassword(){
        setProvidedPasswordState('');
        setAlphabetState(false);
        setNumeralsState(false);
        setSymbolsState(false);
        setLengthState('');
        setErrorMessageState('');
        setMessageState('');
    }

    function onCancelEdit(){
        setDomainState('');
        setProvidedPasswordState('');
        setAlphabetState(false);
        setNumeralsState(false);
        setSymbolsState(false);
        setLengthState('');
        setEditingState({
            isEditing: false,
            editingId: ''
          });
        setErrorMessageState('');
        setMessageState('');
    }

    async function logout(){
        try{
            const response = await axios.post('/api/passwordUser/logout');
            navigate('/');
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
      }
    
    async function isLoggedIn() {
        try {
            const response = await axios.get('/api/passwordUser/loggedIn');
            const username = response.data.username;
            setUsername(username);
        } 
        catch (error) {
            navigate('/')
        }
    }

    async function updateShareRequest(requestId, newStatus){
        try{
            await axios.put('/api/share/' + requestId, 
            {status: newStatus});
            setMessageState("Request approved successfully! ");
            setErrorMessageState("");
        
            setDomainState('');
            setProvidedPasswordState('');
            setAlphabetState(false);
            setNumeralsState(false);
            setSymbolsState(false);
            setLengthState('');

            setEditingState({
                isEditing: false,
                editingId: ''
            });
            await getAllPassword();
            await getAllShareRequests();
            await getAllSharedPasswords();
        }
        catch(error){
            console.log(error);
            if (error.response && error.response.data) {
                setErrorMessageState(error.response.data);
            } else {
                setErrorMessageState("An error occurred while processing the request.");
            }
        }
    }

    function togglePasswordVisibility() {
        const toggleButton = document.getElementById('togglePasswordButton');
        const passwordInput = document.getElementById('passwordEntry');
      
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text'; 
          toggleButton.textContent = 'Hide';
        } else {
          passwordInput.type = 'password';
          toggleButton.textContent = 'Show';
        }
    }
    
    function onStart() {
        isLoggedIn()
        .then(() => {
        getAllPassword();
        getAllShareRequests();
        getAllSharedPasswords();
        })
    }

    useEffect(onStart, []);

    const displayedPasswords = (
        <table className="password-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Password</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {passwordListState.map((password, index) => (
              <tr key={password._id}>
                <td>{password.domain}</td>
                <td>{password.password}</td>
                <td>
                  <button onClick={() => deletePassword(password._id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => setEditPassword(password._id, password.domain, password.password)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );      

    const displayedShareRequests = (
        <table className="share-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Accept</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {shareRequestListState.map((req, index) => (
              <tr key={req._id}>
                <td>{req.requesterUsername}</td>
                <td>
                    <button onClick={() => updateShareRequest(req._id, 'accepted')}>Accept</button>
                </td>
                <td>
                    <button onClick={() => updateShareRequest(req._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );      

      const SharedPasswordsTable = ({ sharedPasswordListState }) => {
        const [passwordVisibility, setPasswordVisibility] = useState({});
      
        const togglePasswordDisplayVisibility = (passwordId) => {
          setPasswordVisibility((prevVisibility) => ({
            ...prevVisibility,
            [passwordId]: !prevVisibility[passwordId],
          }));
        };
      
        return (
          <table className="shared-password-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Password</th>
                <th>Action</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {sharedPasswordListState.map((password, index) => (
                <tr key={password._id}>
                  <td>{password.domain}</td>
                  <td>
                    {passwordVisibility[password._id] ? password.password : '******'}
                  </td>
                  <td>
                    <button onClick={() => togglePasswordDisplayVisibility(password._id)}>
                        {passwordVisibility[password._id] ? 'Hide' : 'Show'}
                    </button>
                  </td>
                  <td>{password.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      };

  const inputFieldTitleText = editingState.isEditing? "Edit Password" : "Add New Password";

    return (
        <>
        <h1>Password Manager</h1>
        <NavBar isAuthenticated={isLoggedIn()} username={username} />
        <ul>
            <div id='errorMessage'>{errorMessageState? errorMessageState : ""}</div>
            <div id='message'>{messageState? messageState : ''}</div>
        </ul>
        <h2>{inputFieldTitleText}</h2>
        <ul><div className='inputContainer'>
          <div><label>Domain (URL or other name): </label><input value={domainState} onInput={(event) => updateDomain(event)}></input></div>
          <div>
            <label>Password: </label>
            <input id = "passwordEntry" value={providedPasswordState} onInput={(event) => updateProvidedPassword(event)}></input>
            <button id="togglePasswordButton" onClick={() =>togglePasswordVisibility()}>Show/Hide</button>
        </div>
          <div><label>Length: </label><input value={lengthState} onInput={(event) => updateLength(event)}></input></div>
          
          <div className='checkboxContainer'>
            <div>
                <label htmlFor="alphabetCheckbox">Alphabet</label>
                <input type="checkbox" id="alphabetCheckbox" name="alphabet" checked={alphabetState}
                    onChange={(event) => toggleCheckbox(event)}/>
            </div>
            <div>
                <label htmlFor="numeralsCheckbox">Numerals</label>
                <input type="checkbox" id="numeralsCheckbox" name="numerals" checked={numeralsState}
                    onChange={(event) => toggleCheckbox(event)}/>
            </div>
            <div>
                <label htmlFor="symbolsCheckbox">Symbols</label>
                <input type="checkbox" id="symbolsCheckbox" name="symbols" checked={symbolsState}
                    onChange={(event) => toggleCheckbox(event)}/>
            </div>
        </div>

        <div className='buttonContainer'>
          <button onClick={()=> onSubmit()}>Submit</button>
          <button onClick={()=> onClearPassword()}>Clear Password</button>
          {editingState.isEditing && <button onClick={() => onCancelEdit()}>Cancel Edit</button>}
        </div>
        
        </div></ul>
        
        <h2>Your Passwords</h2>
        <ul>
            {passwordListState.length <= 0? "You currently have no passwords. " : displayedPasswords}
        </ul>
        
        <h2>Share Password</h2>
        <ul>
            <div className='sharePassword'>
                <label>Enter Username: </label><input value={shareUsername} onInput={(event) => updateShareUsername(event)}></input>
                <button onClick={()=> onSubmitShareRequest()}>Submit</button>
            </div>
        </ul>
        
        <h2>Your Pending Share Requests</h2>
        <ul>
            {shareRequestListState.length <= 0? 'You currently have no pending share requests. ' : displayedShareRequests}
        </ul>

        <h2>Passwords Shared with You</h2>
        <ul>
            {sharedPasswordListState.length <= 0? "You currently have no shared passwords. " : <SharedPasswordsTable sharedPasswordListState={sharedPasswordListState}></SharedPasswordsTable>}
        </ul>
        </>
    );
}
export default PasswordManagerPage;