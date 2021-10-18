import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwt from 'jsonwebtoken';


import './Login.scss';

import { AuthInput } from '../../components';
import { Routes, linkToRoute } from '../../utils/routes';
import { signIn } from '../../redux/actions/authActions'
import { getCookie, setCookie } from '../../utils/cookie';
import { authApi } from '../../api/authApi';

const Login = () => {

	const history = useHistory();
	const dispatch = useDispatch();

	const [loginForm, setLoginForm] = useState({
		nicknameValue:'',
		passwordValue: ''
	});
	
	//types of errors: empty, notValid, notExists
	const [loginFormError, setLoginFormError] = useState({
		nicknameError:'',
		passwordError: ''
	});

	const { nicknameValue, passwordValue} = loginForm;
	const { nicknameError, passwordError} = loginFormError;

	const handleChangeLoginForm = (event, inputName, errorName) =>{

		const loginFormCopy = {...loginForm};
		const loginFormErrorCopy = {...loginFormError};

		loginFormErrorCopy[errorName] = '';
		setLoginFormError(loginFormErrorCopy);

		loginFormCopy[inputName] = event.target.value;
		setLoginForm(loginFormCopy);
		

	}	

	//check inputs for empty value
	const handleCheckEmptyInput = (loginForm, loginFormError, inputName, errorName) => {

		if(loginForm[inputName] === ''){ 
			loginFormError[errorName] = 'empty';
			return true;
		}
		return false;
	}

		
	const handleCheckEmptyForm  = (event = {}, inputName = '', errorName= '') => {

		const loginFormCopy = {...loginForm};
		const loginFormErrorCopy = {...loginFormError};

		let resultCheckEmpty = false;
		let resultCheckEmptyLogin = false;
		let resultCheckEmptyPassword = false;

		if(inputName !== '' && errorName !== ''){
		
			resultCheckEmpty = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, inputName, errorName);

			setLoginFormError(loginFormErrorCopy);

		} else{
			//check all iputs
			resultCheckEmptyLogin = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'nicknameValue', 'nicknameError');
			resultCheckEmptyPassword = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'passwordValue', 'passwordError');

			resultCheckEmpty = resultCheckEmptyPassword || resultCheckEmptyLogin;
			
			setLoginFormError(loginFormErrorCopy);
		}
		return resultCheckEmpty;
	}
	
	

	const handleSubmitForm = async (event) =>{

		try {
			event.preventDefault();

			if ((handleCheckEmptyForm())){
				return;
			}
			
			const user = {
				userName: nicknameValue,
				password: passwordValue
			}
			
			const res = await authApi.signInUser(user)
			const { token } = res.data

			setCookie('authorization', token )

			const decodedData = jwt.decode(token);
			console.log('decodedData', decodedData)
			const {role, id: userId} = decodedData
			dispatch(signIn({ role, token, userId }))

			if(role ==='admin'){
				linkToRoute(history, Routes.UsersRoute)
			} else {
				linkToRoute(history, Routes.TasksRoute)
			}

		} catch (error) {
			const loginFormErrorCopy  = { ...loginFormError }
			console.log('signIn error', error.response.data.message)
			const errorMessage = error.response.data.message

			if(errorMessage === 'No user with such userName'){
				loginFormErrorCopy['nicknameError'] = 'notExists'
			}else if(errorMessage === 'Passwords did not match') {
				loginFormErrorCopy['passwordError'] = 'notValid'
			}
			setLoginFormError(loginFormErrorCopy);
		}
	}

  	return (
		<section className='logIn'>
			<div className='container'>
				<div className='logIn-wrapper'>

					<div className='logIn-wrapper-title'>
						<h1 className='logIn-wrapper-title-value'>
						Sign in
						</h1>
					</div>

					<form className='logIn-wrapper-form' onSubmit={handleSubmitForm}>
						<AuthInput
						inputTitle='Nickname'
						inputValueName='nicknameValue'
						inputErrorName='nicknameError'
						inputValue={nicknameValue}
						inputError={nicknameError}
						emptyValidationText='Enter nickname'
						notExistValidationText="User with such nickname doesn't exist"
						handleChangeForm={handleChangeLoginForm}
						handleCheckEmptyForm={handleCheckEmptyForm} />

						<AuthInput
							inputTitle='Password'
							inputType='password'
							inputValueName='passwordValue'
							inputErrorName='passwordError'
							inputValue={passwordValue}
							inputError={passwordError}
							emptyValidationText='Enter password'
							invalidValidationText = 'Incorrect password'
							handleChangeForm={handleChangeLoginForm}
							handleCheckEmptyForm={handleCheckEmptyForm} />

						<div className='logIn-wrapper-form-button'>
							<input 
							className='logIn-wrapper-form-button-submit' 
							type='submit' 
							value='Sign in'></input>
						</div>

						<div className ='logIn-wrapper-form-signUp'>
							<Link to={Routes.SignUpRoute} className='logIn-wrapper-form-signUp-value'>Sign Up</Link>
						</div>

					</form>
				</div>
			</div>
		</section>
  );
};

export default Login;
