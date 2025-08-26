import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'

import Landing from './routes/Landing'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Feed from './routes/Feed'
import Chat from './routes/Chat'
import Profile from './routes/Profile'
import { AuthProvider } from './auth/AuthContext'
import RequireAuth from './components/RequireAuth'

const router = createBrowserRouter([
	{ path: '/', element: <Landing /> },
	{ path: '/login', element: <Login /> },
	{ path: '/signup', element: <Signup /> },
	{ path: '/feed', element: <App><RequireAuth><Feed /></RequireAuth></App> },
	{ path: '/chat', element: <App><RequireAuth><Chat /></RequireAuth></App> },
	{ path: '/profile', element: <App><RequireAuth><Profile /></RequireAuth></App> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>,
)
