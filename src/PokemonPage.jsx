import axios from 'axios';
import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
//import './Pokemon.css'

function PokemonPage() {
  const navigate = useNavigate();
  const [pokemonListState, setPokemonListState] = useState([]);

  const [pokemonNameState, setPokemonNameState] = useState('');
  const [pokemonColorState, setPokemonColorState] = useState('');

  const [editingState, setEditingState] = useState({
    isEditing: false,
    editingId: ''
  });
  const [errorMessageState, setErrorMessageState] = useState('');
  const [username, setUsername] = useState('');

  async function getAllPokemon(){
    const response = await axios.get('/api/pokemon');
    console.log(response);
    setPokemonListState(response.data)
  }

  //pass pokemonName to backend api (delete + /api/pokemon/pokemonId)
  async function deletePokemon(pokemonId){
    await axios.delete('/api/pokemon/' + pokemonId);
    await getAllPokemon();
  }

  async function onSubmit(){
    setErrorMessageState("");
    try{
      if(editingState.isEditing){ //if editing, put
        await axios.put('/api/pokemon/' + editingState.editingId, 
          {name: pokemonNameState, color: pokemonColorState});
      }
      else{ //if creating new
        await axios.post('/api/pokemon/', {name: pokemonNameState, color: pokemonColorState});
      }
      setPokemonNameState("");
      setPokemonColorState("");
      setEditingState({
        isEditing: false,
        editingId: ''
      });
      await getAllPokemon();
    }
    catch(error){
        console.log(error);
        setErrorMessageState(error.response.data);
    }
  }

  async function setEditPokemon(pokemonId, pokemonName, pokemonColor){
    setPokemonNameState(pokemonName);
    setPokemonColorState(pokemonColor);
    setEditingState({
      isEditing: true,
      editingId: pokemonId
    });
  }

  function updatePokemonName(event){
    setPokemonNameState(event.target.value);
  }
  
  function updatePokemonColor(event){
    setPokemonColorState(event.target.value);
  }

  function onCancel(){
    setEditingState({
      isEditing: false,
      editingId: '',
    });
    setPokemonNameState('');
    setPokemonColorState('');
  }

  async function logout(){
    const response = await axios.post('/api/pokemonUser/logout');
    navigate('/');
  }

  async function isLoggedIn() {
    try {
      const response = await axios.get('/api/pokemonUser/loggedIn');
      const username = response.data.username;
      setUsername(username);
    } catch (e) {
      navigate('/')
    }
  }

  function onStart() {
    isLoggedIn()
      .then(() => {
        getAllPokemon()
      })
  }

  useEffect(onStart, []);

  //use a for loop to generate html for the pokemon list display
  const pokemonElement = [];
  for(let i = 0; i < pokemonListState.length; i++){
    pokemonElement.push(
    <li>Name: {pokemonListState[i].name} 
        - Color: {pokemonListState[i].color}
        - <button onClick={() => deletePokemon(pokemonListState[i]._id)}>Delete</button>
        - <button onClick={() => setEditPokemon(pokemonListState[i]._id, pokemonListState[i].name, pokemonListState[i].color)}>Edit</button>
    </li>);
  }

  const inputFieldTitleText = editingState.isEditing? "Edit Pokemon" : "Add New Pokemon";

  if(!username){
    return <div>Loading...</div>
  }
  return (
    <>
      <button onClick={logout}>Log out</button>
      <div>
        {errorMessageState && <h1>
          {errorMessageState}
          </h1>}
        Here are all your pokemon, {username} !!!
        <ul>
          {pokemonElement}
        </ul>
        <div>{inputFieldTitleText}</div>
        <div>
          <label>Name: </label><input value={pokemonNameState} onInput={(event) => updatePokemonName(event)}></input>
          <label>Color: </label><input value={pokemonColorState} onInput={(event) => updatePokemonColor(event)}></input>
          <button onClick={()=> onSubmit()}>Submit</button>
          <button onClick={()=> onCancel()}>Cancel</button>
        </div>
      </div>
      <h2>Pokemon Name State: {pokemonNameState}</h2>
      <h2>Pokemon Color State: {pokemonColorState}</h2>
    </>
  )
}

export default PokemonPage
