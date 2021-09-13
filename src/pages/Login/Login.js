import React from "react";
import "./Login.scss";
import { Routes } from "../../utils/routes";
import { Link } from "react-router-dom";
const Login = () => {
  return (
		<section className="logIn">
			<div className="container">
				<div className="logIn-wrapper">
					<div className="logIn-wrapper-title">
						<h1 className="logIn-wrapper-title-value">
						Sign in
						</h1>
					</div>
					<form className="logIn-wrapper-form">
						<div className="logIn-wrapper-form-input">
							<label className="logIn-wrapper-form-input-label">
								<p className="logIn-wrapper-form-input-label-value">
								Login
								</p>
							</label>
							<input
								className="logIn-wrapper-form-input-value"
								type="email"
								required="required"
							></input>
						</div>
						<div className="logIn-wrapper-form-input">
							<label className="logIn-wrapper-form-input-label">
								<p className="logIn-wrapper-form-input-label-value">
								Password
								</p>
							</label>
							<input
								className="logIn-wrapper-form-input-value"
								type="password"
								required="required"
								minlength="5"
							></input>
						</div>
						<div className='logIn-wrapper-form-button'>
							<input className='logIn-wrapper-form-button-submit' type='button' value='Sign in'></input>
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
