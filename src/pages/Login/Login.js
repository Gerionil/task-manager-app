import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Login.scss";

import { Routes } from "../../utils/routes";

const Login = () => {

	const [loginForm, setLoginForm] = useState({
		loginValue:'',
		passwordValue: ''
	});
	//types of errors: empty, notValid, notExists
	const [loginFormError, setLoginFormError] = useState({
		loginError:'',
		passwordError: ''
	});

	const { loginValue, passwordValue} = loginForm;
	const { loginError, passwordError} = loginFormError;

	const handleChangeLoginForm = (event, inputName, errorName) =>{

		const loginFormCopy = {...loginForm};
		const loginFormErrorCopy = {...loginFormError};

		loginFormErrorCopy[errorName] = '';
		setLoginFormError(loginFormErrorCopy);

		loginFormCopy[inputName] = event.target.value;
		setLoginForm(loginFormCopy);
		

	}	

	//check inputs for empty value
	const handleCheckEmptyInput = (loginForm, loginFormError, inputName, errorName) =>{
		if (loginForm[inputName] === ''){
			loginFormError[errorName] = 'empty';
			return true;
		}
		return false;
	}

	//check email for validity
	// regular expression for valid email -  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	const handleCheckValidEmail = ( loginFormError ) => {

		const mailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if(!mailRegExp.test(loginValue) && loginValue !== ''){

			loginFormError['loginError'] = 'notValid';
		}
	}
		




	const handleCheckEmptyForm  = (event = {}, inputName = '', errorName= '') => {

		const loginFormCopy = {...loginForm};
		const loginFormErrorCopy = {...loginFormError};

		let resultCheckEmpty = false;
		let resultCheckEmptyLogin = false;
		let resultCheckEmptyPassword = false;

		handleCheckValidEmail(loginFormErrorCopy);

		if(inputName !== '' && errorName !== ''){
		
			resultCheckEmpty = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, inputName, errorName);

			setLoginFormError(loginFormErrorCopy);

		} else{
			//check all iputs
			resultCheckEmptyLogin = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'loginValue', 'loginError');
			resultCheckEmptyPassword = handleCheckEmptyInput(loginFormCopy, loginFormErrorCopy, 'passwordValue', 'passwordError');

			resultCheckEmpty =  resultCheckEmptyPassword;
			
			setLoginFormError(loginFormErrorCopy);
		}
	
		return resultCheckEmpty;
	}
	
	

	const handleSubmitForm = (event) =>{
		event.preventDefault();
		if ((handleCheckEmptyForm())){
			return;
		}

		
	}

  return (
		<section className="logIn">
			<div className="container">
				<div className="logIn-wrapper">

					<div className="logIn-wrapper-title">
						<h1 className="logIn-wrapper-title-value">
						Sign in
						</h1>
					</div>

					<form className="logIn-wrapper-form" onSubmit={handleSubmitForm}>

						<div className="logIn-wrapper-form-input">
							<label className="logIn-wrapper-form-input-label">
								<p className="logIn-wrapper-form-input-label-value">
								Login
								</p>
							</label>

							<input
								className={loginError === '' ? "logIn-wrapper-form-input-value" : "logIn-wrapper-form-input-value error"}
								type="text"
								name='loginValue'
								value={loginValue}
								onChange ={event => handleChangeLoginForm(event,'loginValue', 'loginError')}
								onBlur={event => handleCheckEmptyForm(event, 'loginValue', 'loginError')}	
							/>
							{loginError === 'empty' &&	<span className='logIn-wrapper-form-input-error'>Введите логин</span>}
							{loginError === 'notValid' && <span className='logIn-wrapper-form-input-error'>Формат логина не верный</span>}
							{loginError === 'notExists' && <span className='logIn-wrapper-form-input-error'>Пользователя с таким логином не существует</span> }
						</div>

						<div className="logIn-wrapper-form-input">
							<label className="logIn-wrapper-form-input-label">
								<p className="logIn-wrapper-form-input-label-value">
								Password
								</p>
							</label>
							<input
								className={passwordError === '' ? "logIn-wrapper-form-input-value" : "logIn-wrapper-form-input-value error"}
								type="password"
								name='passwordValue'
								value={passwordValue}
								onChange ={event => handleChangeLoginForm(event,'passwordValue', 'passwordError')}
								onBlur={event => handleCheckEmptyForm(event, 'passwordValue', 'passwordError')}	
							/>
							{passwordError === 'empty' && <span className='logIn-wrapper-form-input-error'>Введите пароль</span>}
							{passwordError === 'notValid' && <span className='logIn-wrapper-form-input-error'>Пароль неверный</span>}
						</div>

						<div className='logIn-wrapper-form-button'>
							<input className='logIn-wrapper-form-button-submit' type='submit' value='Sign in'></input>
						</div>

						<div className ='logIn-wrapper-form-signUp'>
							<Link to={Routes.SignUpRoute} className="logIn-wrapper-form-signUp-value">Sign Up</Link>
						</div>

					</form>
				</div>
			</div>
		</section>
  );
};

export default Login;
