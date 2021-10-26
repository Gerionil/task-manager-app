import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';

import "./Registration.scss";

import { AuthInput, AuthSelect } from '../../components'
import { authApi } from '../../api/authApi';
import { usersApi } from '../../api/usersApi';
import { Routes,linkToRoute } from "../../utils/routes";

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
	const history = useHistory()

	useEffect(() => {
		getAdminsList();
	},[])

	const getAdminsList = () => {
		usersApi.getAdmins()
		.then(res => {
			const adminList = res.data;
			setAdmins(adminList);
		})
	}

	const handleChangeRole = (event, inputName, errorName) => {
		const { value } = event.target;
		const signUpFormErrorCopy = { ...signUpFormError };
		const signUpFormCopy = { ...signUpForm };
		if(value === 'admin') {
			signUpFormErrorCopy['selectAdminError'] = '';
			signUpFormCopy['adminValue'] = '';
		}
		handleChangeSignUpForm(event, inputName, errorName, signUpFormCopy, signUpFormErrorCopy)
	}

	const handleChangeSignUpForm = (event, inputName, errorName, signUpFormCopyArg = undefined, signUpFormErrorCopyArg = undefined) => {
		const signUpFormCopy = signUpFormCopyArg || { ...signUpForm };
		const signUpFormErrorCopy = signUpFormErrorCopyArg || { ...signUpFormError };

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

	const handleCheckUserExists = async (signUpFormErrorCopy, fieldName, fieldValue,errorField) => {
		const body = {};
		body[fieldName] = fieldValue;

		return usersApi.checkUsersExists(body)
			.then(res => {
				const {data} = res
				if(data.exists){
					signUpFormErrorCopy[errorField] = 'alreadyExist'
				}
			})
	}

	const handleCheckValidNickname = async (signUpFormError) => {
		const minLetters = /(?=(?:.*[a-zA-Z]){3,})/;
		if (nicknameValue !== "") {
			if (!minLetters.test(nicknameValue) || !(nicknameValue.length >= 5)) {
				signUpFormError["nicknameError"] = "notValid";
			} else {
				await handleCheckUserExists(signUpFormError, 'userName',nicknameValue, 'nicknameError');
			}
		}
	};

	
	const handleCheckValidEmail = async (signUpFormError) => {
		const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if (!mailRegex.test(loginValue) && loginValue !== "") {
			signUpFormError["loginError"] = "notValid";
		} else {
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
			// console.log("Форма не отправлена.");
			return;
		}
		// console.log("Форма отправлена.");

		const newUser = {
			userName: nicknameValue,
			login: loginValue,
			password: passwordValue, 
			role: selectValue
		}
		
		if (selectValue === 'user') {
			newUser.adminId = adminValue;
		}

		await authApi.signUpUser(newUser);
		linkToRoute(history, Routes.SignInRoute)
	};

	const roleSelectOption = () => {
		return (
			<>
			<option value="user">User</option>
			<option value="admin">Administrator</option>
			</>
		)
	}

	const adminSelectOption = () => {
		return (
			admins.map((admin) => {
				const { _id, userName, login } = admin
				return <option value ={_id}> {userName} </option>
			})
		)
	}

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

						<AuthInput 
							inputTitle='Nickname'
							inputValueName='nicknameValue'
							inputErrorName='nicknameError'
							inputValue={nicknameValue}
							inputError={nicknameError} 
							emptyValidationText='Enter nickname'
							invalidValidationText='Invalid format (at least 5 symbols and 3 letters)'
							existsValidationText='This nickname already exists'
							handleChangeForm={handleChangeSignUpForm}
							handleCheckEmptyForm={handleCheckEmptySignUpForm}/>
						
						<AuthInput 
							inputTitle='Login'
							inputValueName='loginValue'
							inputErrorName='loginError'
							inputValue={loginValue}
							inputError={loginError} 
							emptyValidationText='Enter login'
							invalidValidationText='Invalid format (email)'
							existsValidationText='This login already exists'
							handleChangeForm={handleChangeSignUpForm}
							handleCheckEmptyForm={handleCheckEmptySignUpForm}/>
						
						<AuthInput 
							inputTitle='Password'
							inputType = 'password'
							inputValueName='passwordValue'
							inputErrorName='passwordError'
							inputValue={passwordValue}
							inputError={passwordError} 
							emptyValidationText='Enter password' 
							invalidValidationText='At least 5 symbols and 1 letter and digit'
							handleChangeForm={handleChangeSignUpForm}
							handleCheckEmptyForm={handleCheckEmptySignUpForm}/>

						<AuthInput 
							inputTitle='Repeat password'
							inputType = 'password'
							disabled={passwordValue === "" ? true : false}
							inputValueName='repeatedPasswordValue'
							inputErrorName='repeatedPasswordError'
							inputValue={repeatedPasswordValue}
							inputError={repeatedPasswordError} 
							emptyValidationText='Repeat password'
							notMatchValidationText='Passwords should match'
							handleChangeForm={handleChangeSignUpForm}
							handleCheckEmptyForm={handleCheckEmptySignUpForm}/>	

						<AuthSelect 
							selectTitle='Choose a role:'
							selectValueName="selectValue"
							selectErrorName="selectRoleError"
							selectValue={selectValue}
							selectError={selectRoleError}
							childOptions={roleSelectOption()}
							defaultValueText='Please, choose a role'
							emptyValidationText='Choose a role'
							handleChangeForm={handleChangeRole}
							handleCheckEmptyForm={handleCheckEmptySignUpForm} />
	
						{selectValue === "user" && (
						<AuthSelect 
							selectTitle='Choose administrator:'
							selectValueName="adminValue"
							selectErrorName="selectAdminError"
							selectValue={adminValue}
							selectError={selectAdminError}
							childOptions={adminSelectOption()}
							defaultValueText='Please, choose administrator'
							emptyValidationText='Choose administrator'
							handleChangeForm={handleChangeRole}
							handleCheckEmptyForm={handleCheckEmptySignUpForm} />
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
