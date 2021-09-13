import React from "react";
import { Routes } from "../../utils/routes";
import { Link } from "react-router-dom";
import './Registration.scss';

const Registration = () => {
	return (
			
		<section className="registration">
			<div className="container">
				<div className="registration-wrapper">
					<div className="registration-wrapper-title">
						<h1 className="registration-wrapper-title-value">
						Sign Up
						</h1>
					</div>
					<form className="registration-wrapper-form">
						<div className ='registration-wrapper-form-backward'>
							<Link to={Routes.SignInRoute} className="registration-wrapper-form-backward-value">Back</Link>
						</div>
						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label">
								<p className="registration-wrapper-form-input-label-value">
								Nickname
								</p>
							</label>
							<input
								className="registration-wrapper-form-input-value"
								type="text"
								required="required"
							></input>
						</div>
						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label">
								<p className="registration-wrapper-form-input-label-value">
								Login
								</p>
							</label>
							<input
								className="registration-wrapper-form-input-value"
								type="email"
								required="required"
							></input>
						</div>
						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label">
								<p className="registration-wrapper-form-input-label-value">
								Password
								</p>
							</label>
							<input
								className="registration-wrapper-form-input-value"
								type="password"
								required="required"
								minlength="5"
							></input>
						</div>
						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label">
								<p className="registration-wrapper-form-input-label-value">
								Repeat password
								</p>
							</label>
							<input
								className="registration-wrapper-form-input-value"
								type="password"
								required="required"
								minlength="5"
							></input>
						</div>
						<div className="registration-wrapper-form-input">
							<label className="registration-wrapper-form-input-label" for='role-select'>
								<p className="registration-wrapper-form-input-label-value">
								Choose a role:
								</p>
							</label>
							<select name='roles' id='role-select' className="registration-wrapper-form-input-value">
								<option value="" selected disabled>Please, choose a role</option>
								<option value="user">User</option>
								<option value="administrator">Administrator</option>
							</select>
						</div>
						<div className='registration-wrapper-form-button'>
							<input className='registration-wrapper-form-button-submit' type='button' value='Sign up'></input>
						</div>
						
					</form>
					
				</div>
			</div>
		</section>
	);
};

export default Registration;
