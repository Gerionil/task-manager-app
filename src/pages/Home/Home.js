import React, { useEffect }  from 'react';
import { useHistory } from 'react-router-dom';
import {  useSelector } from 'react-redux'

import './Home.scss';

import { Routes, linkToRoute } from '../../utils/routes';


const Home  = () =>{

    const history = useHistory();
	const { token, role } = useSelector( state => state.authReducer );

    useEffect(() => {  
        if (token) {
            linkToStartPage(role);
        }else {
            linkToRoute(history, Routes.SignInRoute)   
        }
    },[])

    const linkToStartPage = (role) => {
        if(role ==='admin'){
            linkToRoute(history, Routes.UsersRoute)
        } else {
            linkToRoute(history, Routes.TasksRoute)
        }
    }


    return (
    <h1>Домашняя страница</h1>
    )
}

export default Home;