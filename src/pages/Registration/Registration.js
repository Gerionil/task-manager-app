import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Registration.scss";

import { authApi } from '../../api/authApi';
import { usersApi } from '../../api/usersApi';
import { Routes } from "../../utils/routes";

const Registration = () => {
	const [signUpForm, setSignUpForm] = useState({
		nicknameValue: "",
		loginValue: "",
		passwordValue: "",
		repeatedPasswordValue: "",
		selectValue: "",
		adminValue: ''
	});
	//types of errors: empty, notValid, alreadyExist, notMatch
	const [signUpFormError, setSignUpFormError] = useState({
		nicknameError: "",
		loginError: "",
		passwordError: "",
		repeatedPasswordError: "",
		selectRoleError: "",
		selectAdminError: ''
	});

	const {
		nicknameValue,
		loginValue,
		passwordValue,
		repeatedPasswordValue,
		selectValue,
		adminValue
	} = signUpForm;
	const {
		nicknameError,
		loginError,
		passwordError,
		repeatedPasswordError,
		selectRoleError,
		selectAdminError
	} = signUpFormError;


	const [admins, setAdmins] = useState([]);

	useEffect(() => {
		getAdminsList();
	},[])

	const getAdminsList = () => {
		usersApi.getAdmins()
		.then(res => {
			const admindList = res.data;
			setAdmins(admindList);
		})
	}

	const handleChangeRole = (event, inputName, errorName) => {
		const value = event.target
		if(value === 'admin') {
			const signUpFormErrorCopy = { ...signUpFormError };
			signUpFormErrorCopy[selectAdminError] = '';
			setSignUpFormError(signUpFormErrorCopy);
		}
		handleChangeSignUpForm(event, inputName, errorName)
	}
	const handleChangeSignUpForm = (event, inputName, errorName) => {
		const signUpFormCopy = { ...signUpForm };
		const signUpFormErrorCopy = { ...signUpFormError };

		signUpFormErrorCopy[errorName] = "";
		setSignUpFormError(signUpFormErrorCopy);

		signUpFormCopy[inputName] = event.target.value;
		setSignUpForm(signUpFormCopy);
	};

	const handleCheckEmptyInput = (
		signUpForm,
		signUpFormError,
		inputName,
		errorName
	) => {
		if (signUpForm[inputName] === "") {
			signUpFormError[errorName] = "empty";
			return true;
		}
		return false;
	};

	const handleCheckUserExists = async (signUpFormErrorCopy, fieldName, fieldValue,errorField) =>{
		const body = {};
		body[fieldName] = fieldValue;
		console.log('handleCheckUserExists', body)

		return usersApi.checkUsersExists(body)
			.then(res => {
				const {data} = res
				if(data.exists){
					signUpFormErrorCopy[errorField] = 'alreadyExist'
				}
				console.log('handleCheckUserExists', res)
			})
	}

	const handleCheckValidNickname = async (signUpFormError) => {
		const minLetters = /(?=(?:.*[a-zA-Z]){3,})/;
		if (nicknameValue !== "") {
			if (!minLetters.test(nicknameValue) || !(nicknameValue.length >= 5)) {
				signUpFormError["nicknameError"] = "notValid";
			}else {
				// console.log();
				await handleCheckUserExists(signUpFormError, 'userName',nicknameValue, 'nicknameError');
			}
		}
	};

	
	const handleCheckValidEmail = async (signUpFormError) => {
		const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if (!mailRegex.test(loginValue) && loginValue !== "") {
			signUpFormError["loginError"] = "notValid";
		}else {
			// console.log();
			await handleCheckUserExists(signUpFormError, 'login', loginValue, 'loginError');
		}
	};

	const handleCheckValidPassword = (signUpFormError) => {
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

		if (!passwordRegex.test(passwordValue) && passwordValue !== "") {
			signUpFormError["passwordError"] = "notValid";
		}
	};

	const handleCheckPasswordMatch = (signUpFormError) => {
		if (
			repeatedPasswordValue !== passwordValue &&
			repeatedPasswordValue !== ""
		) {
			signUpFormError["repeatedPasswordError"] = "notMatch";
		}
	};


	const handleCheckValidInput = async (inputName, signUpFormError  ) => {
		if(inputName !== ''){
			switch(inputName){
				case 'nicknameValue':
					await handleCheckValidNickname(signUpFormError);
					break

				case 'loginValue':
					await handleCheckValidEmail(signUpFormError);
					break

				case 'passwordValue':
					handleCheckValidPassword(signUpFormError);
					break

				case 'repeatedPasswordValue':
					handleCheckPasswordMatch(signUpFormError);
					break
				
				default:
					console.log('Input with this name is not exists')
			}
		}
	}

	const handleCheckEmptySignUpForm = async (
		event = {},
		inputName = "",
		errorName = ""
	) => {
		const signUpFormCopy = { ...signUpForm };
		const signUpFormErrorCopy = { ...signUpFormError };

		let resultCheckEmpty = false;
		
		await handleCheckValidInput(inputName, signUpFormErrorCopy);
		
		if (inputName !== "" && errorName !== "") {
			resultCheckEmpty = handleCheckEmptyInput(
				signUpFormCopy,
				signUpFormErrorCopy,
				inputName,
				errorName
			);
			setSignUpFormError(signUpFormErrorCopy);
		} else {

			const valuesNameForm = Object.keys(signUpFormCopy)
			const errorsNameForm = Object.keys(signUpFormErrorCopy)

			if(selectValue === 'admin'){
				valuesNameForm.pop();
				errorsNameForm.pop();

			}

			const checkEmptyArray = Array(valuesNameForm.length).fill(false)

			
			for(let i = 0; i < valuesNameForm.length; i++){ 

				checkEmptyArray[i] = handleCheckEmptyInput(
						signUpFormCopy,
						signUpFormErrorCopy,
						valuesNameForm[i],
						errorsNameForm[i]
					);
			}
			

			resultCheckEmpty = checkEmptyArray.some(check => check === true)

			setSignUpFormError(signUpFormErrorCopy);
		}
		return resultCheckEmpty;
	};

	const handleSubmitForm = async (event) => {
		event.preventDefault();
		const isFormInvalid = await handleCheckEmptySignUpForm();

		if (isFormInvalid) {
			console.log("Форма не отправлена.");
			return;
		}
		console.log("Форма отправлена.");

	
		const newUser = {
			userName: nicknameValue,
			login: loginValue,
			password: passwordValue, 
			role: selectValue
		}
		//send request to server
		//role: 'admin' || 'user'
		//for admin
		// newUser = {
		// 	userName: '',
		// 	password: '', 
		// 	role: ''
		// }

		// //for user
		// newUser = {
		// 	userName: '',
		// 	password: '', 
		// 	role: '',
		// 	adminId: ''
		// }

		await authApi.signUpUser(newUser);
		
	};

	return (
		<section className="registration">
			<div className="container">
				<div className="registration-wrapper">
					<div className="registration-wrapper-title">
						<h1 className="registration-wrapper-title-value">Sign Up</h1>
					</div>

					<form
						className="registration-wrapper-form"
						onSubmit={handleSubmitForm}
					>
						<div className="registration-wrapper-form-backward">
							<Link
								to={Routes.SignInRoute}
								className="registration-wrapper-form-backward-value"
							>
								Back
							</Link>
						</div>

						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label" htmlFor = 'nicknameValue'>
								<p className="registration-wrapper-form-input-label-value">
									Nickname
								</p>
							</label>
							<input
								className={
									nicknameError === ""
										? "registration-wrapper-form-input-value"
										: "registration-wrapper-form-input-value error"
								}
								type="text"
								value={nicknameValue}
								name="nicknameValue"
								id='nicknameValue'
								onChange={(event) =>
									handleChangeSignUpForm(
										event,
										"nicknameValue",
										"nicknameError"
									)
								}
								onBlur={(event) =>
									handleCheckEmptySignUpForm(
										event,
										"nicknameValue",
										"nicknameError"
									)
								}
							/>
							{nicknameError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Введите никнейм
								</span>
							)}
							{nicknameError === "notValid" && (
								<span className="registration-wrapper-form-input-error">
									Формат никнейма не верный
								</span>
							)}
							{nicknameError === "alreadyExist" && (
								<span className="registration-wrapper-form-input-error">
									Данный никнейм уже зарегистрирован
								</span>
							)}
						</div>

						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label" htmlFor='login'>
								<p className="registration-wrapper-form-input-label-value">
									Login
								</p>
							</label>
							<input
								className={
									loginError === ""
										? "registration-wrapper-form-input-value"
										: "registration-wrapper-form-input-value error"
								}
								type="text"
								name="loginValue"
								value={loginValue}
								id='login'
								onChange={(event) =>
									handleChangeSignUpForm(event, "loginValue", "loginError")
								}
								onBlur={(event) =>
									handleCheckEmptySignUpForm(event, "loginValue", "loginError")
								}
							/>
							{loginError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Введите логин
								</span>
							)}
							{loginError === "notValid" && (
								<span className="registration-wrapper-form-input-error">
									Формат логина не верный
								</span>
							)}
							{loginError === "alreadyExist" && (
								<span className="registration-wrapper-form-input-error">
									Данный логин уже зарегистрирован
								</span>
							)}
						</div>

						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label" htmlFor='passwordValue'>
								<p className="registration-wrapper-form-input-label-value">
									Password
								</p>
							</label>
							<input
								className={
									passwordError === ""
										? "registration-wrapper-form-input-value"
										: "registration-wrapper-form-input-value error"
								}
								type="text"
								name="passwordValue"
								value={passwordValue}
								id='passwordValue'
								onChange={(event) =>
									handleChangeSignUpForm(
										event,
										"passwordValue",
										"passwordError"
									)
								}
								onBlur={(event) =>
									handleCheckEmptySignUpForm(
										event,
										"passwordValue",
										"passwordError"
									)
								}
							/>
							{passwordError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Введите пароль
								</span>
							)}
							{passwordError === "notValid" && (
								<span className="registration-wrapper-form-input-error">
									Min. 5 символов(min 1 цифра и min 1 буква)
								</span>
							)}
						</div>

						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label" htmlFor='repeatPassword'>
								<p className="registration-wrapper-form-input-label-value">
									Repeat password
								</p>
							</label>
							<input
								className={
									passwordValue === ""
										? "registration-wrapper-form-input-value disabled"
										: repeatedPasswordError === ""
										? "registration-wrapper-form-input-value"
										: "registration-wrapper-form-input-value error"
								}
								name="repeatedPasswordValue"
								type="text"
								value={repeatedPasswordValue}
								id='repeatPassword'
								onChange={(event) =>
									handleChangeSignUpForm(
										event,
										"repeatedPasswordValue",
										"repeatedPasswordError"
									)
								}
								onBlur={(event) =>
									handleCheckEmptySignUpForm(
										event,
										"repeatedPasswordValue",
										"repeatedPasswordError"
									)
								}
								disabled={passwordValue === "" ? true : false}
							/>
							{repeatedPasswordError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Повторите пароль
								</span>
							)}
							{repeatedPasswordError === "notMatch" && (
								<span className="registration-wrapper-form-input-error">
									Пароли должны совпадать
								</span>
							)}
						</div>

						<div className="registration-wrapper-form-input">
							<label
								className="registration-wrapper-form-input-label"
								htmlFor="role-select"
							>
								<p className="registration-wrapper-form-input-label-value">
									Choose a role:
								</p>
							</label>
							<select
								className={
									selectRoleError === ""
										? "registration-wrapper-form-input-value"
										: "registration-wrapper-form-input-value error"
								}
								name="selectValue"
								id="role-select"
								value={selectValue}
								onChange={(event) =>
									handleChangeRole(event, "selectValue", "selectRoleError" )
									// handleChangeSignUpForm(event, "selectValue", "selectRoleError")
								}
								onBlur={(event) =>
									handleCheckEmptySignUpForm(
										event,
										"selectValue",
										"selectRoleError"
									)
								}
							>
								<option value="" disabled>
									Please, choose a role
								</option>
								<option value="user">User</option>
								<option value="admin">Administrator</option>
							</select>
							{selectRoleError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Выберите роль
								</span>
							)}
						</div>

						{selectValue === "user" && (
							<div className="registration-wrapper-form-input">
								<label
									className="registration-wrapper-form-input-label"
									htmlFor="administrators"
								>
									<p className="registration-wrapper-form-input-label-value">
										Choose administrator:
									</p>
								</label>
								<select
									// className="registration-wrapper-form-input-value"
									className={
										selectAdminError === ""
											? "registration-wrapper-form-input-value"
											: "registration-wrapper-form-input-value error"
									}
									name="adminValue"
									id="admin-select"
									value={adminValue}
									onChange={(event) =>
										handleChangeSignUpForm(event, "adminValue", "selectAdminError")
									}
									onBlur={(event) =>
										handleCheckEmptySignUpForm(
											event,
											"adminValue",
											"selectAdminError"
										)
									}
								>
									<option value="" disabled>
										Please, choose administrator
									</option>
									{
									admins.map((admin) => {
										const { id, userName, login } = admin
									return <option value ={id}> {userName} </option>
									})
									}
								</select>
								{selectAdminError === "empty" && (
								<span className="registration-wrapper-form-input-error">
									Выберите админа
								</span>
								)}
							</div>
								
						)}

						<div className="registration-wrapper-form-button">
							<input
								className="registration-wrapper-form-button-submit"
								type="submit"
								value="Sign up"
							></input>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};

export default Registration;
