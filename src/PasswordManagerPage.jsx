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
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_-+=[]{}|;:,.<>?';
    
        let characters = '';
        let password = '';
    
        if (alphabetState) {
            characters += lowercaseLetters;
            characters += uppercaseLetters;
        }
        if (numeralsState) {
            characters += numbers;
        }
        if (symbolsState) {
            characters += symbols;
        }
        password += getRandomCharacter(lowercaseLetters); 
        password += getRandomCharacter(uppercaseLetters); 
        password += getRandomCharacter(numbers); 
        password += getRandomCharacter(symbols);
    
        for (let i = password.length; i < lengthState; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    
        return password;
    }
    
    function getRandomCharacter(characters) {
        return characters.charAt(Math.floor(Math.random() * characters.length));
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

    function onStart() {
        isLoggedIn()
        .then(() => {
        getAllPassword();
        getAllShareRequests();
        getAllSharedPasswords();
        })
    }

    async function approveShareRequest(requestId){
        try{
            await axios.put('/api/share/' + requestId, 
            {status: 'accepted'});
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

    async function rejectShareRequest(requestId){
        try{
            await axios.put('/api/share/' + requestId, 
            {status: 'rejected'});
            setMessageState("Request rejected successfully! ");
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

    useEffect(onStart, []);

    const displayedPasswords = [];
    for(let i = 0; i < passwordListState.length; i++){
        displayedPasswords.push(
        <li>Domain: {passwordListState[i].domain} 
            - Password: {passwordListState[i].password}
            - <button onClick={() => deletePassword(passwordListState[i]._id)}>Delete</button>
            - <button onClick={() => setEditPassword(passwordListState[i]._id, passwordListState[i].domain, passwordListState[i].password)}>Edit</button>
        </li>);
    }
    
    const displayedShareRequests = [];
    for(let i = 0; i < shareRequestListState.length; i++){
        displayedShareRequests.push(
            <li>User: {shareRequestListState[i].requesterUsername} 
            - <button onClick={() => approveShareRequest(shareRequestListState[i]._id)}>Accept</button>
            - <button onClick={() => rejectShareRequest(shareRequestListState[i]._id)}>Reject</button>
            </li>);
    }

    const displayedSharedPasswords = [];
    for(let i = 0; i < sharedPasswordListState.length; i++){
        displayedSharedPasswords.push(
        <li>Domain: {sharedPasswordListState[i].domain} 
            - Password: {sharedPasswordListState[i].password}
            - Owner: {sharedPasswordListState[i].user}
        </li>);
    }

  const inputFieldTitleText = editingState.isEditing? "Edit Password" : "Add New Password";

    return (
        <>
        <h1>Password Manager</h1>
        <NavBar isAuthenticated={isLoggedIn()} username={username} />

        <h2>{inputFieldTitleText}</h2>

        <div>
          <div><label>Domain (URL or other name): </label><input value={domainState} onInput={(event) => updateDomain(event)}></input></div>
          <div><label>Password: </label><input value={providedPasswordState} onInput={(event) => updateProvidedPassword(event)}></input></div>
          <div><label>Length: </label><input value={lengthState} onInput={(event) => updateLength(event)}></input></div>
          <button onClick={()=> onSubmit()}>Submit</button>
          <button onClick={()=> onClearPassword()}>Clear Password</button>
          {editingState.isEditing && <button onClick={() => onCancelEdit()}>Cancel Edit</button>}
        </div>

        <div id='checkboxContainer'>
            <div>
                <label htmlFor="alphabetCheckbox">Alphabet</label>
                <input
                    type="checkbox"
                    id="alphabetCheckbox"
                    name="alphabet"
                    checked={alphabetState}
                    onChange={(event) => toggleCheckbox(event)}
                />
            </div>
            <div>
                <label htmlFor="numeralsCheckbox">Numerals</label>
                <input
                    type="checkbox"
                    id="numeralsCheckbox"
                    name="numerals"
                    checked={numeralsState}
                    onChange={(event) => toggleCheckbox(event)}
                />
            </div>
            <div>
                <label htmlFor="symbolsCheckbox">Symbols</label>
                <input
                    type="checkbox"
                    id="symbolsCheckbox"
                    name="symbols"
                    checked={symbolsState}
                    onChange={(event) => toggleCheckbox(event)}
                />
            </div>
        </div>
        <h3 id='errorMessage'>Error Message: {errorMessageState? errorMessageState : ""}</h3>
        <h3 id='message'>Regular Message: {messageState? messageState : ''}</h3>
        
        <h2>Your Passwords</h2>
        <ul>
          {displayedPasswords}
        </ul>
        
        <h2>Share Password</h2>
        <div><label>Enter Username: </label><input value={shareUsername} onInput={(event) => updateShareUsername(event)}></input></div>
        <button onClick={()=> onSubmitShareRequest()}>Submit</button>

        <h2>Your Pending Share Requests</h2>
        <ul>
            {displayedShareRequests}
        </ul>
            
        <h2>Passwords Shared with You</h2>
        <ul>
            {displayedSharedPasswords}
        </ul>
        </>
    );
}
export default PasswordManagerPage;