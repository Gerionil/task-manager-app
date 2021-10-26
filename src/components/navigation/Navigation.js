import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {  useSelector } from 'react-redux'

import './Navigation.scss';

import { Routes } from '../../utils/routes'
import { deleteCookie } from "../../utils/cookie";

const Navigation = () => {

	const history = useHistory();
	

	const [activeRoute, setActiveRoute] = useState(history.location.pathname);
	
	const { role } = useSelector( state => state.authReducer );
	useEffect(() => {

		return history.listen((location) => { 
			// console.log(`You changed the page to: ${location.pathname}`) 
			return setActiveRoute(location.pathname);
		})
	},[history])
	
	const handleDeleteToken = () => {
		console.log('handleDeleteToken')
		
		deleteCookie('authorization');

	}

	return (
		<div className='navigation-container'>
			{role=== 'admin'
			&&
			<Link to={Routes.UsersRoute}>
				<div className={activeRoute === Routes.UsersRoute ? 'navigation-container-item active':'navigation-container-item'}>Users </div>
			</Link>
			}
			
			{role==='user'
			&&
			<Link to={Routes.TasksRoute}>
				<div className={activeRoute === Routes.TasksRoute ? 'navigation-container-item active':'navigation-container-item'}>Tasks</div>
			</Link>
			}
			

			<Link to={Routes.SignInRoute} onClick={() => handleDeleteToken()}>
				<div className={activeRoute === Routes.SignInRoute ? 'navigation-container-item active':'navigation-container-item'}>Log out</div>
			</Link>
		</div>
	);
};

export default Navigation;
