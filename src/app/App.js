import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import {  useSelector } from 'react-redux'

import { Routes } from '../utils/routes';
import { Login, Registration, Tasks, Users, Home} from '../pages'

import { AuthorizedRoute, NotAuthorizedRoute } from '../components/routes/';



const App = () => {

	const { token, role } = useSelector( state => state.authReducer );

	return(
		<Router> 

			<NotAuthorizedRoute 
				path={Routes.HomeRoute} 
				component = {Home} 
			/>

			<NotAuthorizedRoute 
				path={Routes.SignInRoute} 
				component = {Login}
			/>
			
			<NotAuthorizedRoute 
				path={Routes.SignUpRoute} 
				component = {Registration} 
			/>
			
			<AuthorizedRoute 
				path={Routes.TasksRoute} 
				isAuthorized={Boolean(token)}
				hasPermission = {role === 'user'}
				component = {Tasks} 
			/>
			<AuthorizedRoute 
				path={`${Routes.TasksRoute}/:id`} 
				isAuthorized={Boolean(token)}
				hasPermission = {role === 'admin'}
				component = {Tasks} 
			/>
			
			<AuthorizedRoute 
				path={Routes.UsersRoute}
				isAuthorized={Boolean(token)}
				hasPermission = {role === 'admin'}
				component = {Users}
			/>
			
		</Router>
	)
}

export default App;
