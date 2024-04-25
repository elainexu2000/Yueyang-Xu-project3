import axios from 'axios';
import {useEffect, useState } from 'react'
//import './App.css'

function App() {
  const [usernameState, setUsernameState] = useState('');

  // function getRandomUsername(){
  //   console.log('line 1');
  //   axios.get('https://randomuser.me/api')
  //   .then(function(response){
  //     console.log('line 2');
  //   });
  //   console.log('line 3');
  // }

  // async: function signature keyword
  // await: action that requires async operations
  // to see structure of API response, print it in console first
  async function getRandomUsername(){
    const response = await axios.get('https://randomuser.me/api');
    console.log(response);
    const firstName = response.data.results[0].name.first;
    setUsernameState(firstName);
    console.log(firstName);
  }

  useEffect(function(){
    console.log("App loaded!");
    getRandomUsername();
    console.log("App has finished loading!");
  }, [])

  return (
    <div>
      Hello, {usernameState} !!!
    </div>
  )
}

export default App
