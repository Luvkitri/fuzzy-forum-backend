const { body, validationResult } = require('express-validator')

const signupValidationRules = () => {
    return [
        body('login', 'Please enter a valid login').custom((value) => {
            if (value.lenght > 0 && value.lenght < 3) {
                throw new Error('Login needs to be at least 3 characters long');
            }

            return true;
        }),
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Please enter a valid password, at least 6 characters').isLength({ min: 6 }),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }

            return true;
        })
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    });
}

module.exports = {
    signupValidationRules,
    validate,
}