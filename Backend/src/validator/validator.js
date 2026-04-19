import { body, validationResult} from 'express-validator'

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateRegisterUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('contact')
        .trim()
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[0-9+()\-\s]{7,20}$/).withMessage('Invalid contact number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname').notEmpty().isLength({ min: 3, max: 100 }).withMessage('Full name is required'),
    body('isSeller').isBoolean().withMessage('isSeller must be a boolean value'),


    validateRequest
]

export const validateLoginUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
]


