import React, { useState, useEffect } from "react";
import {  useSelector } from 'react-redux'
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';


import './Users.scss'

import { Routes, linkToRoute } from '../../utils/routes';
import { getCookie,deleteCookie } from "../../utils/cookie";
import { usersApi } from '../../api/usersApi';
import { UserItem } from '../../components';

const Users = () => {
	
	const { token } = useSelector( state => state.authReducer );
	const history = useHistory()

	const [users, setUsers] = useState([]);
	const [searchText,setSearchText] = useState('');
	const [foundUsers, setFoundUsers] = useState([]);
	const [activeSearch, setActiveSearch] = useState(false);

	useEffect(() => {

		const { exp } = jwt.decode(token)
		const expirationTime = (exp * 1000) - 60000
		if (Date.now() >= expirationTime) {
			linkToRoute(history, Routes.SignInRoute);
			deleteCookie('authorization');
		}else{
			getUsers()
		}
	}, [])


	const getUsers = () => {

		usersApi.getUsers(token)
			.then((res) => {
				setUsers(res.data)
			})

			.catch (error => {
				console.log('error.message', error.message);
			}) 
		
	}

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
	};


	const handleSearchSubmit = (event) => {
		event.preventDefault();
		const usersCopy = [...users];
		const foundUsersCopy = usersCopy.filter(user => user.userName.includes(searchText));
		setFoundUsers(foundUsersCopy);
		if( !foundUsers || !searchText){	
			setActiveSearch(false);
		} else {
			setActiveSearch(true);
		}
	}
	
	// const handleChangeSearchText = event => {
	// 	setSearchError(false);
	// 	setSearchErrorText('');
	// 	setSearchText(event.target.value);

	// }

	// const checkIput = () => {
	// 	const searchTextCopy = searchText;
	// 	if (searchTextCopy.trim().length === 0){
	// 		setSearchError(true);
	// 		setSearchErrorText('Enter nickname')
	// 		return true
	// 	}
	// 	return false;
	// }

	// const handleSearchSubmit = event =>{
	// 	event.preventDefault();

	// 	if( checkInput() ) {
	// 		return;
	// 	}

	// 	getUsers();
	// }

	const renderUsers = (arr) => {
		let result;
		result = arr.map((item, index) => (
			<UserItem
				serialNumber={index + 1}
				id={item._id}
				nickname={item.userName}
				login={item.login}
				// onClick={}
			/>
		));

		return result;
	}
	
	return (
		<section className='users'>
			<div className='container'>
				<div className='users-wrapper'>
					<div className='users-wrapper-search'>
						<div className='users-wrapper-search-icon'>
							<img src='/img/users_icon.svg' alt='users'/>
						</div>	

							<form className='users-wrapper-search-form' onSubmit={handleSearchSubmit}>
								<input 
								type='text' 
								placeholder='Enter nickname'
								onChange={handleSearchChange}
								value={searchText}/>
								<button>Search user</button>
							</form>

					</div>
					<div className='users-wrapper-list'>
						<ul className='users-wrapper-list-value'>{users && users.length > 0 && (!activeSearch ? renderUsers(users) : renderUsers(foundUsers))}</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Users;
