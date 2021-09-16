import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Registration.scss';

import { Routes } from '../../utils/routes';



const Registration = () => {

  const [signUpForm, setSignUpForm] = useState({
    nicknameValue: '',
    loginValue: '',
    passwordValue: '',
    repeatedPasswordValue: '',
    selectValue: '',
  });
	//types of errors: empty, notValid, alreadyExist, notMatch
  const [signUpFormError, setSignUpFormError] = useState({
    nicknameError: '',
    loginError: '',
    passwordError: '',
    repeatedPasswordError: '',
    selectError: ''
  });

  const { nicknameValue, loginValue, passwordValue, repeatedPasswordValue, selectValue } = signUpForm;
  const { nicknameError, loginError, passwordError, repeatedPasswordError, selectError } = signUpFormError;

  const handleChangeSignUpForm = (event, inputName, errorName) => {

	const signUpFormCopy = {...signUpForm};
	const signUpFormErrorCopy = {...signUpFormError};

	signUpFormErrorCopy[errorName] = '';
	setSignUpFormError(signUpFormErrorCopy);

	signUpFormCopy[inputName] = event.target.value;
	setSignUpForm(signUpFormCopy);
  };

  const handleCheckEmptyInput = (signUpForm, signUpFormError, inputName, errorName) => {

	if(signUpForm[inputName] === ''){
		signUpFormError[errorName] = 'empty';
		return true;
	}
	return false;
  }

  const handleCheckValidNickname = (signUpFormError) => {

	const minLetters = /(?=(?:.*[a-zA-Z]){3,})/;
	if (nicknameValue !== ''){
		if(!minLetters.test(nicknameValue) || !(nicknameValue.length >= 5)){
			signUpFormError['nicknameError'] = 'notValid';
		}
	}
  }	

  const handleCheckValidEmail = (signUpFormError) => {

	const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	if(!mailRegex.test(loginValue) && loginValue !== ''){

		signUpFormError['loginError'] = 'notValid';
	}
  }

  const handleCheckValidPassword = (signUpFormError) => {

	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

	if (!passwordRegex.test(passwordValue) && passwordValue !== ''){
		signUpFormError['passwordError'] = 'notValid'
	}
  }

  const handleCheckPasswordMatch = (signUpFormError) => {

	if (repeatedPasswordValue !== passwordValue && repeatedPasswordValue !== ''){
		signUpFormError['repeatedPasswordError'] = 'notMatch'
	}
  }

  const handleCheckEmptySignUpForm = (event = {}, inputName = '', errorName ='') => {

	const signUpFormCopy = {...signUpForm};
	const signUpFormErrorCopy = {...signUpFormError};

	let resultCheckEmpty = false;
	let resultCheckEmptyNickname = false;
	let resultCheckEmptyLogin = false;
	let resultCheckEmptyPassword = false;
	let resultCheckEmptyRepeatedPassword = false;
	let resultCheckEmptySelect = false;
	
	handleCheckValidNickname(signUpFormErrorCopy);
	handleCheckValidEmail(signUpFormErrorCopy);
	handleCheckValidPassword(signUpFormErrorCopy);
	handleCheckPasswordMatch(signUpFormErrorCopy);

	if(inputName !== '' && errorName !== ''){

		resultCheckEmpty = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, inputName, errorName);
		setSignUpFormError(signUpFormErrorCopy);

	}else{

		resultCheckEmptyNickname = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, 'nicknameValue', 'nicknameError')
		resultCheckEmptyLogin = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, 'loginValue', 'loginError')
		resultCheckEmptyPassword = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, 'passwordValue', 'passwordError')
		resultCheckEmptyRepeatedPassword = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, 'repeatedPasswordValue', 'repeatedPasswordError')
		resultCheckEmptySelect = handleCheckEmptyInput(signUpFormCopy, signUpFormErrorCopy, 'selectValue', 'selectError')

		resultCheckEmpty = resultCheckEmptyNickname || resultCheckEmptyLogin || resultCheckEmptyPassword || resultCheckEmptyRepeatedPassword || resultCheckEmptySelect;

		setSignUpFormError(signUpFormErrorCopy);

	}
	return resultCheckEmpty;
  }

  const handleSubmitForm = (event) => {

	event.preventDefault();

	  if(handleCheckEmptySignUpForm()){
		  return;
	  }
  }


  return (
    <section className='registration'>
      <div className='container'>
        <div className='registration-wrapper'>

          <div className='registration-wrapper-title'>
            <h1 className='registration-wrapper-title-value'>Sign Up</h1>
          </div>

          <form className='registration-wrapper-form' onSubmit={handleSubmitForm}>

            <div className='registration-wrapper-form-backward'>
				<Link
					to={Routes.SignInRoute}
					className='registration-wrapper-form-backward-value'
				>
					Back
				</Link>
            </div>

            <div className='registration-wrapper-form-input'>
				<label className='registration-wrapper-form-input-label'>
					<p className='registration-wrapper-form-input-label-value'>
					Nickname
					</p>
				</label>
				<input
					className={nicknameError === '' ? 'registration-wrapper-form-input-value' : 'registration-wrapper-form-input-value error'}
					type='text'
					value={nicknameValue}
					name='nicknameValue'
					onChange={ event => handleChangeSignUpForm(event, 'nicknameValue', 'nicknameError' )}
					onBlur={ event => handleCheckEmptySignUpForm(event, 'nicknameValue', 'nicknameError')}
				/>
				{nicknameError === 'empty' && <span className='registration-wrapper-form-input-error'>Введите никнейм</span>}
				{nicknameError === 'notValid' && <span className='registration-wrapper-form-input-error'>Формат никнейма не верный</span>}
				{nicknameError === 'alreadyExist' &&  <span className='registration-wrapper-form-input-error'>Данный никнейм уже зарегистрирован</span>}
            </div>

            <div className='registration-wrapper-form-input'>
				<label className='registration-wrapper-form-input-label'>
					<p className='registration-wrapper-form-input-label-value'>
					Login
					</p>
				</label>
				<input
					className={loginError === '' ? 'registration-wrapper-form-input-value' : 'registration-wrapper-form-input-value error'}
					type='text'
					name= 'loginValue'
					value={loginValue}
					onChange={ event => handleChangeSignUpForm(event, 'loginValue', 'loginError' )}
					onBlur={event => handleCheckEmptySignUpForm(event, 'loginValue', 'loginError')}

				/>
				{loginError === 'empty' && <span className='registration-wrapper-form-input-error'>Введите логин</span>}
				{loginError === 'notValid' && <span className='registration-wrapper-form-input-error'>Формат логина не верный</span>}
				{loginError === 'alreadyExist' &&  <span className='registration-wrapper-form-input-error'>Данный логин уже зарегистрирован</span>}
            </div>

            <div className='registration-wrapper-form-input'>
              <label className='registration-wrapper-form-input-label'>
                <p className='registration-wrapper-form-input-label-value'>
                  Password
                </p>
              </label>
              <input
				className={passwordError === '' ? 'registration-wrapper-form-input-value' : 'registration-wrapper-form-input-value error'}
				type= 'text'
				name='passwordValue'
				value={passwordValue}
				onChange={ event => handleChangeSignUpForm(event, 'passwordValue', 'passwordError' )}
				onBlur={event => handleCheckEmptySignUpForm(event, 'passwordValue', 'passwordError')}

              />
				{passwordError === 'empty' && <span className='registration-wrapper-form-input-error'>Введите пароль</span>}
				{passwordError === 'notValid' && <span className='registration-wrapper-form-input-error'>Min. 5 символов(min 1 цифра и min 1 буква)</span>}
            </div>

            <div className='registration-wrapper-form-input'>
				<label className='registration-wrapper-form-input-label'>
					<p className='registration-wrapper-form-input-label-value'>
					Repeat password
					</p>
				</label>
				<input
					className={ passwordValue === '' ? 'registration-wrapper-form-input-value disabled' : repeatedPasswordError === '' ? 'registration-wrapper-form-input-value' : 'registration-wrapper-form-input-value error'}
					name='repeatedPasswordValue'
					type='text'
					value={repeatedPasswordValue}
					onChange={ event => handleChangeSignUpForm(event, 'repeatedPasswordValue', 'repeatedPasswordError' )}
					onBlur={event => handleCheckEmptySignUpForm(event, 'repeatedPasswordValue', 'repeatedPasswordError')}
					disabled={passwordValue === '' ? true : false}
				/>
					{repeatedPasswordError === 'empty' && <span className='registration-wrapper-form-input-error'>Повторите пароль</span>}
					{repeatedPasswordError === 'notMatch' && <span className='registration-wrapper-form-input-error'>Пароли должны совпадать</span>}
            </div>

            <div className='registration-wrapper-form-input'>
				<label
					className='registration-wrapper-form-input-label'
					htmlFor='role-select'
				>
					<p className='registration-wrapper-form-input-label-value'>
					Choose a role:
					</p>
				</label>
              <select
					className={selectError === '' ? 'registration-wrapper-form-input-value' : 'registration-wrapper-form-input-value error'}
					name='selectValue'
					id='role-select'
					value={selectValue}
					onChange={ event => handleChangeSignUpForm(event, 'selectValue', 'selectError' )}
					onBlur={event => handleCheckEmptySignUpForm(event, 'selectValue', 'selectError')}
					>
					<option value='' disabled>
						Please, choose a role
					</option>
					<option value='user'>User</option>
					<option value='administrator'>Administrator</option>
              </select>
			  {selectError === 'empty' && <span className='registration-wrapper-form-input-error'>Выберите роль</span>}
            </div>

			{selectValue === 'user' && (
                <div className='registration-wrapper-form-input'>
					<label
						className='registration-wrapper-form-input-label'
						htmlFor='administrators'
					>
						<p className='registration-wrapper-form-input-label-value'>
						Choose administrator:
						</p>
					</label>
					<select
						name='administrators'
						id='role-select'
						className='registration-wrapper-form-input-value'
					>
						<option value='administrator' disabled>
							Please, choose administrator
						</option>
					</select>
				  
                </div>
              )}

            <div className='registration-wrapper-form-button'>
				<input
					className='registration-wrapper-form-button-submit'
					type='submit'
					value='Sign up'
				></input>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Registration;
