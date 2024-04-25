import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PokemonPage from './PokemonPage.jsx'
import PasswordManagerPage from './PasswordManagerPage.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PokemonLoginPage from './PokemonLoginPage.jsx'
import PokemonRegisterPage from './PokemonRegisterPage.jsx'
//import './index.css'

const router = createBrowserRouter([
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <PokemonPage /> */}
    {/* <PasswordManagerPage></PasswordManagerPage> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
