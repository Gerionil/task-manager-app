import React from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory  } from 'react-router-dom';


import { Routes } from '../utils/routes';
import { Login, Registration, Tasks, Users, Home} from '../pages'

import Navigation from '../components/navigation/Navigation';
import { AuthorizedRoute, NotAuthorizedRoute } from '../components/routes/'
import ToDoApp from '../components/toDoApp/ToDoApp';

const App = () => {

	return(
		<Router>


			<NotAuthorizedRoute  path={Routes.HomeRoute} component = {Home} />

			<NotAuthorizedRoute  path={Routes.SignInRoute} component = {Login} />
			
			<NotAuthorizedRoute  path={Routes.SignUpRoute} component = {Registration} />
			
			<AuthorizedRoute  path={Routes.TasksRoute  } component = {Tasks} />
			
			<AuthorizedRoute  path={Routes.UsersRoute}  component = {Users}/>
			
		</Router>
	)
}

export default App;
