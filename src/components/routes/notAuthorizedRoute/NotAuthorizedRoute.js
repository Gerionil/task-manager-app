import React from 'react';
import { Route } from 'react-router-dom';
import { Routes } from '../../../utils/routes';
import { Login } from '../../../pages';

const NotAuthorizedRoute =  (props) =>{
    const {path, component: Component} = props;
    return( 
    <Route exact path={path}>
	    <Component />
    </Route>
    )
}

export default NotAuthorizedRoute;