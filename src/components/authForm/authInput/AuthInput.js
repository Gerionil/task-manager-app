import React from 'react';

import '../AuthForm.scss';


const AuthInput = ({ 
	inputTitle,
	disabled = false,
	inputType = 'text',
	inputValueName,
	inputErrorName,
	inputValue, 
	inputError,  
	emptyValidationText = '', 
	invalidValidationText = '', 
	existsValidationText = '',
	notMatchValidationText = '',
	notExistValidationText = '',
	handleChangeForm,
	handleCheckEmptyForm }) => {
	return (
		<div className="auth-form-input">
			<label
				className="auth-form-input-label"
				htmlFor="nicknameValue"
			>
				<p className="auth-form-input-label-value">{inputTitle}</p>
			</label>
			<input
				className={
					inputError === ""
					? "auth-form-input-value"
					: "auth-form-input-value error"
				}
				type={inputType}
				value={inputValue}
				name={inputValueName}
				id="nicknameValue"
				onChange={(event) =>
					handleChangeForm(event, inputValueName, inputErrorName)
				}
				onBlur={(event) =>
					handleCheckEmptyForm(event, inputValueName, inputErrorName)
				}
				disabled = {disabled}
			/>
			{inputError === "empty" && (
				<span className="auth-form-input-error">
				{emptyValidationText}
				</span>
			)}
			{inputError === "notValid" && (
				<span className="auth-form-input-error">
				{invalidValidationText}
				</span>
			)}
			{inputError === "alreadyExist" && (
				<span className="auth-form-input-error">
				{existsValidationText}
				</span>
			)}
			{inputError === "notMatch" && (
				<span className="auth-form-input-error">
				{notMatchValidationText}
				</span>
			)}
			{inputError === "notExists" && (
				<span className="auth-form-input-error">
				{notExistValidationText}
				</span>
			)}
		</div>
	);
};

export default AuthInput;