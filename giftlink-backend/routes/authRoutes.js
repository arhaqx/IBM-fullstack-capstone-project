/*jshint esversion: 8 */
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const logger = require('../logger');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: verify the JWT sent in the "Authorization: Bearer <token>" header
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        logger.error('Missing auth token');
        return res.status(401).json({ error: 'Authentication token missing' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET).user;
        next();
    } catch (e) {
        logger.error('Invalid auth token');
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * POST /api/auth/register
 * Body: { firstName, lastName, email, password }
 * Returns: { authtoken, email }
 */
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('A valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('firstName').notEmpty().withMessage('First name is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in register request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
            const db = await connectToDatabase();

            // Task 2: Access MongoDB collection
            const collection = db.collection("users");

            // Task 3: Check for existing email
            const existingEmail = await collection.findOne({ email: req.body.email });
            if (existingEmail) {
                logger.error('Email id already exists');
                return res.status(400).json({ error: 'Email id already exists' });
            }

            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(req.body.password, salt);
            const email = req.body.email;

            // Task 4: Save user details in database
            const newUser = await collection.insertOne({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                createdAt: new Date(),
            });

            // Task 5: Create JWT authentication with user._id as payload
            const payload = {
                user: {
                    id: newUser.insertedId,
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User registered successfully');
            res.json({ authtoken, email });
        } catch (e) {
            logger.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { authtoken, userName, userEmail }
 */
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB `users` collection
        const collection = db.collection("users");

        // Task 3: Check for user credentials in database
        const theUser = await collection.findOne({ email: req.body.email });

        // Task 7: Send appropriate message if user not found
        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 4: Check if the password matches the encrypted password and send appropriate message on mismatch
        const result = await bcryptjs.compare(req.body.password || '', theUser.password);
        if (!result) {
            logger.error('Passwords do not match');
            return res.status(404).json({ error: 'Wrong password' });
        }

        // Task 5: Fetch user details from database
        const userName = theUser.firstName;
        const userEmail = theUser.email;

        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const payload = {
            user: {
                id: theUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User logged in successfully');
        return res.status(200).json({ authtoken, userName, userEmail });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

/**
 * PUT /api/auth/update
 * Headers: Authorization: Bearer <token>, Email: <user email>
 * Body: { name }
 * Returns: { authtoken }
 */
router.put(
    '/update',
    authenticate,
    [body('name').notEmpty().withMessage('Name is required')],
    async (req, res) => {
        // Task 2: Validate the input using `validationResult` and return approiate message if there is an error.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
            const email = req.headers.email;
            if (!email) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ error: 'Email not found in the request headers' });
            }

            // Task 4: Connect to MongoDB
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Task 5: Find user credentials in database
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                logger.error('User not found');
                return res.status(404).json({ error: 'User not found' });
            }

            // Make sure the token belongs to the user that is being updated
            if (existingUser._id.toString() !== String(req.user.id)) {
                logger.error('Token does not match user');
                return res.status(403).json({ error: 'Not allowed to update this user' });
            }

            existingUser.firstName = req.body.name;
            existingUser.updatedAt = new Date();

            // Task 6: Update user credentials in database
            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: { firstName: existingUser.firstName, updatedAt: existingUser.updatedAt } },
                { returnDocument: 'after' }
            );

            // Task 7: Create JWT authentication using secret key from .env file
            const payload = {
                user: {
                    id: updatedUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User updated successfully');
            res.json({ authtoken });
        } catch (e) {
            logger.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;
