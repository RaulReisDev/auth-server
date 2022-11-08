import { validationResult } from 'express-validator';
import { v4 as uuid } from 'uuid';

import UsersModel from '../models/UsersModel.js'
import jwt from '../utils/jwt.js'
import bcrypt from '../utils/bcrypt.js'

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

export default {
    login,
    register
}