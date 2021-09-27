import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './Navigation.scss';

import { Routes } from '../../utils/routes'

const Navigation = () => {

	const history = useHistory();
	

	const [activeRoute, setActiveRoute] = useState(history.location.pathname);

	useEffect(() => {
		return history.listen((location) => { 
			console.log(`You changed the page to: ${location.pathname}`) 
			return setActiveRoute(location.pathname);
		 })
	},[history])
  return (
    <div className='navigation-container'>
      <Link to={Routes.UsersRoute}>
        <div className={activeRoute === Routes.UsersRoute ? 'navigation-container-item active':'navigation-container-item'}>Пользователи </div>
      </Link>
     
      <Link to={Routes.TasksRoute}>
        <div className={activeRoute === Routes.TasksRoute ? 'navigation-container-item active':'navigation-container-item'}>Мои задачи</div>
      </Link>
      <Link to={Routes.SignInRoute}>
        <div className={activeRoute === Routes.SignInRoute ? 'navigation-container-item active':'navigation-container-item'}>Выход</div>
      </Link>

      {/* <Link to={Routes.SignUpRoute}>
        <div className={activeRoute === Routes.SignUpRoute ? 'navigation-container-item active':'navigation-container-item'}>Регистрация</div>
      </Link>
	  <Link to={Routes.UsersRoute}>
        <div className={activeRoute === Routes.UsersRoute ? 'navigation-container-item active':'navigation-container-item'}>Пользователи</div>
      </Link> */}
    </div>
  );
};

export default Navigation;
