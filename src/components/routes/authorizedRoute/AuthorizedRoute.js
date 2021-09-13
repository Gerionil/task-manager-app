import React from 'react';
import { Route } from 'react-router-dom';
import { Routes } from '../../../utils/routes'
// import { Users } from '../../../pages'
import Navigation  from '../../navigation/Navigation';
const AuthorizedRoute = (props) =>{
    const {path, component: Component} = props;
    return( 
    <>
        
        <Route exact path={path}>
            <Navigation />
            <Component />
        </Route>
    </>
    )
}

export default AuthorizedRoute;