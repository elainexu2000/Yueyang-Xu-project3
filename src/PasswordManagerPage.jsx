import axios from 'axios';
import {useEffect, useState } from 'react'
//import { getAllPassword } from '../backend/db/password.model.cjs';

function PasswordManagerPage(){
    const [passwordListState, setPasswordListState] = useState([]);

    const [domainState, setDomainState] = useState('');
    const [providedPasswordState, setProvidedPasswordState] = useState('');
    const [alphabetState, setAlphabetState] = useState(false);
    const [numeralsState, setNumeralsState] = useState(false);
    const [symbolsState, setSymbolsState] = useState(false);
    const [lengthState, setLengthState] = useState('');

    const [errorMessageState, setErrorMessageState] = useState('');
    const [editingState, setEditingState] = useState({
        isEditing: false,
        editingId: ''
      });

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

    async function getAllPassword(){
        const response = await axios.get('/api/password');
        //console.log(response);
        setPasswordListState(response.data);
    }
      
    async function deletePassword(passwordId){
        await axios.delete('/api/password/' + passwordId);
        await getAllPassword();
    }

    async function onSubmit(){
        setErrorMessageState("");
        try{
        if(editingState.isEditing){ //if editing, put
            await axios.put('/api/password/' + editingState.editingId, 
            {domain: domainState, password: providedPasswordState, user: 'v'});
        }
        else{ //if creating new
            await axios.post('/api/password/', 
            {domain: domainState, password: providedPasswordState, user: "v"});
        }
        setDomainState("");
        setProvidedPasswordState("");
        setEditingState({
            isEditing: false,
            editingId: ''
        });
        await getAllPassword();
        }
        catch(error){
            console.log(error);
            setErrorMessageState(error.response.data);
        }
    }
    // if(!domainState){
    //     setErrorMessageState("Error: Please enter a non-empty domain name. ");
    //     return;
    // }
    // if(providedPasswordState){
    //     console.log("POST {" + domainState + ", " + providedPasswordState + "}");
    // }
    // else{

    // }

    async function setEditPassword(passwordId, passwordDomain, passwordPassword){
        setDomainState(passwordDomain);
        setProvidedPasswordState(passwordPassword);
        setEditingState({
          isEditing: true,
          editingId: passwordId
        });
      }

    function onClear(){
        setDomainState('');
        setProvidedPasswordState('');

        setAlphabetState(false);
        setNumeralsState(false);
        setSymbolsState(false);
        setLengthState('');

        setEditingState({
            isEditing: true,
            editingId: passwordId
          });
        setErrorMessageState('');
    }

    useEffect(function(){
        getAllPassword();
    }, []);

    const displayedPasswords = [];
    
    for(let i = 0; i < passwordListState.length; i++){
        displayedPasswords.push(
        <li>Domain: {passwordListState[i].domain} 
            - Password: {passwordListState[i].password}
            - <button onClick={() => deletePassword(passwordListState[i]._id)}>Delete</button>
            - <button onClick={() => setEditPassword(passwordListState[i]._id, passwordListState[i].domain, passwordListState[i].password)}>Edit</button>
        </li>);
    }

  const inputFieldTitleText = editingState.isEditing? "Edit Password" : "Add New Password";


    return (
        <>
        <h1>Password Manager</h1>

        <h2>Here are all your passwords !!!</h2>
        <ul>
          {displayedPasswords}
        </ul>
        <div>{inputFieldTitleText}</div>

        <div>
          <div><label>Domain (URL or other name): </label><input value={domainState} onInput={(event) => updateDomain(event)}></input></div>
          <div><label>Password: </label><input value={providedPasswordState} onInput={(event) => updateProvidedPassword(event)}></input></div>
          <div><label>Length: </label><input value={lengthState} onInput={(event) => updateLength(event)}></input></div>
          <button onClick={()=> onSubmit()}>Submit</button>
          <button onClick={()=> onClear()}>Clear</button>
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
        
        <div id='errorMessage'>{errorMessageState? errorMessageState : ""}</div>
        <div> 
            <h1>State Monitor:</h1>
            <h3>Domain State: {domainState}</h3>
            <h3>Provided Password State: {providedPasswordState}</h3>
            <h3>Alphabet: {alphabetState? 1:0}</h3>
            <h3>Numerals: {numeralsState? 1:0}</h3>
            <h3>Symbol: {symbolsState? 1:0}</h3>
        </div>
        </>
    );
}
export default PasswordManagerPage;