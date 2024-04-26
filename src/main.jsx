import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import PasswordManagerPage from './PasswordManagerPage.jsx'
import PasswordLoginPage from './PasswordLoginPage.jsx'
import PasswordRegisterPage from './PasswordRegisterPage.jsx'
import Home from './Home.jsx'

//import './index.css'

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
    <RouterProvider router={passwordRouter} />
  </React.StrictMode>,
)
