import { body } from 'express-validator';

const registerValidation = () => {
    return [
        body('name')
            .isLength({ max: 50 })
            .withMessage('name-50-max')
            .exists()
            .withMessage('required-name')
            .trim()
            .escape(),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('invalid-email')
            .exists()
            .withMessage('required-email'),
        body('password')
            .matches(/\d/)
            .withMessage('invalid-password')
            .exists()
            .withMessage('required-password'),
        body('passwordConf')
            .matches(/\d/)
            .withMessage('invalid-password-confirm')
            .exists()
            .withMessage('required-password-confirm'),
    ];
}

const loginValidation = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('invalid-email')
            .exists()
            .withMessage('required-email'),
        body('password')
            .matches(/\d/)
            .withMessage('invalid-password')
            .exists()
            .withMessage('required-password'),
    ];
}

const passwordRecoveryValidation = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('invalid-email')
            .exists()
            .withMessage('required-email')
    ];
}

const resetPasswordValidation = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('invalid-email')
            .exists()
            .withMessage('required-email'),
        body('password')
            .matches(/\d/)
            .withMessage('invalid-password')
            .exists()
            .withMessage('required-password'),
        body('code')
            .isInt({ min: 10000, max: 99999 })
            .withMessage('invalid-length-code')
            .exists()
            .withMessage('required-code'),
    ];
}

export default {
    registerValidation,
    loginValidation,
    passwordRecoveryValidation,
    resetPasswordValidation
}