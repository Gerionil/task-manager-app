import React from 'react';

import '../AuthForm.scss'

import { AuthInput } from '../authInput/AuthInput'

const AuthSelect = ({
    selectTitle,
    selectValueName,
	selectErrorName,
	selectValue, 
    selectError,
    childOptions,
    defaultValueText,
    emptyValidationText,
    handleChangeForm,
	handleCheckEmptyForm 
}) =>{

    return(
        <div className="auth-form-input">
            <label
                className="auth-form-input-label"
                htmlFor="role-select"
            >
                <p className="auth-form-input-label-value">
                    {selectTitle}
                </p>
            </label>
            <select
                className={
                    selectError === ""
                        ? "auth-form-input-value"
                        : "auth-form-input-value error"
                }
                name={selectValueName}
                id="role-select"
                value={selectValue}
                onChange={(event) =>
                    handleChangeForm(event, selectValueName, selectErrorName )
                }
                onBlur={(event) =>
                    handleCheckEmptyForm(
                        event,
                        selectValueName,
                        selectErrorName
                    )
                }
            >
                <option value='' disabled>
                    {defaultValueText}
                </option>
            {childOptions}
            </select>
            {selectError === "empty" && (
                <span className="auth-form-input-error">
                    {emptyValidationText}
                </span>
            )}
        </div>
    )
}

export default AuthSelect;