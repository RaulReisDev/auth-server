import { validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';

import UsersModel from '../models/AuthModel.js'
import jwt from '../utils/jwt.js'
import bcrypt from '../utils/bcrypt.js'
import nodemailer from '../utils/nodemailer.js';

const login = async (req, res) => {

	const errors = validationResult(req);

	if (errors.errors.length === 0) {

		const { email, password } = req.body;

		const getUserData = await UsersModel.getUserByEmail(email);
		
		if (getUserData.length === 1) { // User exists
			const authValidation = await bcrypt.comparePassword(password, getUserData[0].password);
			
			if (authValidation) {

				const jwtToken = jwt.createToken({
					uuid: getUserData[0].uuid,
					email
				});

				res.setHeader('Authorization', `Bearer ${jwtToken}`)
					.status(200)
					.send({
						status: 'success',
						result: {
							uuid: getUserData[0].uuid
						}
					});

			} else { // Wrong password
				res.status(400).send({
					'status': 'error',
					'result': 'auth-failed'
				});
			}

		} else { // User does not exists
			res.status(400).send({
				'status': 'error',
				'result': 'auth-failed'
			});
		}

	} else {

		res.status(400).send({
			'status': 'validation-error',
			'result': errors
		});

	}
}

const register = async (req, res) => {

	const errors = validationResult(req);

	if (errors.errors.length === 0) {

		const { email, name, password, passwordConf } = req.body;

		if (password === passwordConf) {

			const getUserData = await UsersModel.getUserByEmail(email);

			if (getUserData.length === 0) { // User doesn't exists

				const userData = {
					uuid: uuid(),
					name,
					email,
					password: await bcrypt.hashPassword(password)
				};

				await UsersModel.insertNewUser(userData);

				res.status(200).send({
					'status': 'success',
					'result': 'user-created'
				});

			} else { // User exists
				res.status(400).send({
					'status': 'error',
					'result': 'email-taken'
				});
			}

		} else {
			res.status(400).send({
				'status': 'error',
				'result': 'password-does-not-match'
			});
		}

	} else {

		res.status(400).send({
			'status': 'validation-error',
			'result': errors
		});

	}

}

const sendRecoveryCode = async (req, res) => {
	const errors = validationResult(req);

	if (errors.errors.length === 0) {

		const { email } = req.body;

		const userData = await UsersModel.getUserByEmail(email);

		if (userData.length > 0) { // User exists

			let currentDateTime = new Date();
			currentDateTime.setMinutes(currentDateTime.getMinutes() + 30);
			const recoveryCodeExpiration = Date.parse(currentDateTime) / 1000;

			const recoveryCode = Math.floor(Math.random() * 90000) + 10000; // 5 digit number
			const updatedUserData = {
				recoveryCode,
				recoveryCodeExpiration
			};
			
			const mailOptions = {
				from: '"Raul Reis - AuthServer" raulifr@gmail.com',
				to: email,
				subject: 'AuthServer | Recovery code',
				html: '<b>Your recovery code:</b> ' + recoveryCode
			};
			nodemailer.sendEmail(mailOptions);

			await UsersModel.updateUserData(userData[0].uuid, updatedUserData);

			res.status(200).send({
				'status': 'success',
				'result': 'recovery-code-sent'
			});

		} else { // User doesn't exists 
			res.status(200).send({
				'status': 'success',
				'result': 'recovery-code-sent'
			});
		}

	} else {

		res.status(400).send({
			'status': 'validation-error',
			'result': errors
		});

	}
}

const resetPassword = async (req, res) => {
	const errors = validationResult(req);

	if (errors.errors.length === 0) {

		const { email, password, code } = req.body;

		const userData = await UsersModel.getUserByEmail(email);

		if (userData.length > 0) { // User exists

			let currentDateTime = new Date();
			currentDateTime = Date.parse(currentDateTime) / 1000;
			if (currentDateTime <= userData[0].recoveryCodeExpiration && code == userData[0].recoveryCode) { // Verify code expiration with current datetime and the recovery code

				const updatedUserData = {
					password: await bcrypt.hashPassword(password),
					recoveryCode: null,
					recoveryCodeExpiration: null,
				};
				
				const mailOptions = {
					from: '"Raul Reis - AuthServer" raulifr@gmail.com',
					to: email,
					subject: 'AuthServer | Password changes',
					html: '<b>Your password has been changed.</b>'
				};
				nodemailer.sendEmail(mailOptions);
	
				await UsersModel.updateUserData(userData[0].uuid, updatedUserData);
	
				res.status(200).send({
					'status': 'success',
					'result': 'password-changed'
				});

			} else {
				res.status(200).send({
					'status': 'error',
					'result': 'recovery-code-expired'
				});
			}

		} else { // User doesn't exists 
			res.status(200).send({
				'status': 'error',
				'result': 'wrong-code'
			});
		}

	} else {

		res.status(400).send({
			'status': 'validation-error',
			'result': errors
		});

	}
}

export default {
    login,
    register,
	sendRecoveryCode,
	resetPassword
}