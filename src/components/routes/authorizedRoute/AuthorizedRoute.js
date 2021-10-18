import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Routes } from '../../../utils/routes'
import Navigation  from '../../navigation/Navigation';

const AuthorizedRoute = (props) =>{
    const {path, isAuthorized, hasPermission, component: Component} = props;

    return( 
        <Route exact path={path}>
            {(isAuthorized && hasPermission)?
                <>
                    <Navigation />
                    <Component />
                </> :
                <Redirect to={Routes.SignInRoute} />
            }
        </Route>
    )
}

export default AuthorizedRoute;