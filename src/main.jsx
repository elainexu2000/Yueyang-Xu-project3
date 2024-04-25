import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import PokemonPage from './PokemonPage.jsx'
import PokemonLoginPage from './PokemonLoginPage.jsx'
import PokemonRegisterPage from './PokemonRegisterPage.jsx'

import PasswordManagerPage from './PasswordManagerPage.jsx'
import PasswordLoginPage from './PasswordLoginPage.jsx'
import PasswordRegisterPage from './PasswordRegisterPage.jsx'
import Home from './Home.jsx'

//import './index.css'

const pokemonRouter = createBrowserRouter([
  {
    path: '/login',
    element: <PokemonLoginPage/>
  },
  {
    path: '/register',
    element: <PokemonRegisterPage/>
  },
  {
    path: '/pokemon',
    element: <PokemonPage/>
  },
  {
    path: '/',
    element: <h1>Welcome to my website! </h1>
  }
])

const passwordRouter = createBrowserRouter([
  {
    path: '/login',
    element: <PasswordLoginPage/>
  },
  {
    path: '/register',
    element: <PasswordRegisterPage/>
  },
  {
    path: '/password',
    element: <PasswordManagerPage/>
  },
  {
    path: '/',
    element: <Home/>
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <PokemonPage /> */}
    {/* <PasswordManagerPage></PasswordManagerPage> */}
    {/* <RouterProvider router={pokemonRouter} /> */}
    <RouterProvider router={passwordRouter} />
  </React.StrictMode>,
)
