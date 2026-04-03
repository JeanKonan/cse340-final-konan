import { body, param, validationResult } from 'express-validator';

export const ALLOWED_ADMIN_ROLES = ['kitchen', 'admin'];
export const ALLOWED_USER_ROLES = ['customer', 'kitchen', 'admin'];
export const ALLOWED_ORDER_STATUSES = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const getValidationErrors = (req) => validationResult(req).array().map((error) => error.msg);

const phoneValidator = body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9()+\-\s.]+$/)
    .withMessage('Enter a valid phone number');

const nameValidator = body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters');

const emailValidator = body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail();

const passwordValidator = body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long');

export const accountLoginValidators = [
    emailValidator,
    body('password').notEmpty().withMessage('Password is required')
];

export const accountRegisterValidators = [
    nameValidator,
    emailValidator,
    phoneValidator,
    passwordValidator
];

export const contactValidators = [
    nameValidator,
    emailValidator,
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 3, max: 120 }).withMessage('Subject must be between 3 and 120 characters'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

export const menuItemValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 2000 }).withMessage('Description must be 2000 characters or fewer'),
    body('price')
        .trim()
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0.01 }).withMessage('Price must be a valid amount greater than zero')
        .toFloat(),
    body('categoryId')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isInt({ min: 1 }).withMessage('Category is required')
        .toInt(),
    body('available').optional().toBoolean()
];

export const categoryValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer'),
    body('displayOrder')
        .trim()
        .notEmpty().withMessage('Display order is required')
        .isInt({ min: 0 }).withMessage('Display order must be zero or greater')
        .toInt()
];

export const staffAccountValidators = [
    nameValidator,
    emailValidator,
    passwordValidator,
    phoneValidator,
    body('role')
        .trim()
        .isIn(ALLOWED_ADMIN_ROLES).withMessage('Role must be kitchen or admin')
];

export const userRoleValidators = [
    param('id').isInt({ min: 1 }).withMessage('Invalid user id').toInt(),
    body('role')
        .trim()
        .isIn(ALLOWED_USER_ROLES).withMessage('Invalid role selected')
];

export const idParamValidator = [
    param('id').isInt({ min: 1 }).withMessage('Invalid id').toInt()
];

export const cartAddValidators = [
    body('menuItemId')
        .trim()
        .notEmpty().withMessage('Menu item is required')
        .isInt({ min: 1 }).withMessage('Menu item is required')
        .toInt(),
    body('quantity')
        .trim()
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10')
        .toInt()
];

export const cartUpdateValidators = [
    body('menuItemId')
        .trim()
        .notEmpty().withMessage('Menu item is required')
        .isInt({ min: 1 }).withMessage('Menu item is required')
        .toInt(),
    body('quantity')
        .trim()
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 0, max: 10 }).withMessage('Quantity must be between 0 and 10')
        .toInt()
];

export const cartRemoveValidators = [
    body('menuItemId')
        .trim()
        .notEmpty().withMessage('Menu item is required')
        .isInt({ min: 1 }).withMessage('Menu item is required')
        .toInt()
];

const isPickupRequest = (req) => req.body.pickup === true || req.body.pickup === 'true';

export const orderPlaceValidators = [
    body('customerName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('customerEmail')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email address')
        .normalizeEmail(),
    body('customerPhone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[0-9()+\-\s.]+$/).withMessage('Enter a valid phone number'),
    body('pickup').optional().toBoolean(),
    body('street')
        .if((value, { req }) => !isPickupRequest(req))
        .trim()
        .notEmpty().withMessage('Street address is required for delivery orders'),
    body('city')
        .if((value, { req }) => !isPickupRequest(req))
        .trim()
        .notEmpty().withMessage('City is required for delivery orders'),
    body('state')
        .if((value, { req }) => !isPickupRequest(req))
        .trim()
        .isLength({ min: 2, max: 2 }).withMessage('State must be a 2-letter code'),
    body('zip')
        .if((value, { req }) => !isPickupRequest(req))
        .trim()
        .matches(/^\d{5}$/).withMessage('ZIP code must be 5 digits'),
    body('specialInstructions')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Special instructions must be 500 characters or fewer')
];

export const kitchenOrderStatusValidators = [
    param('id').isInt({ min: 1 }).withMessage('Invalid order id').toInt(),
    body('status')
        .trim()
        .isIn(ALLOWED_ORDER_STATUSES).withMessage('Invalid order status')
];

export const kitchenAvailabilityValidators = [
    param('id').isInt({ min: 1 }).withMessage('Invalid menu item id').toInt(),
    body('available')
        .trim()
        .isBoolean().withMessage('Availability must be true or false')
        .toBoolean()
];
