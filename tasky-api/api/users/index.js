import express from 'express';
import User from './userModel';

const router = express.Router(); // eslint-disable-line
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create) User
router.post('/', async (req, res) => {
    try {
      if (req.query.action === 'register') {
        // Validate the request body against the User model schema
        const newUser = new User(req.body);
  
        // Validate password strength
        if (!passwordRegex.test(newUser.password)) {
          return res.status(400).json({
            code: 400,
            msg: 'Password does not meet the required strength criteria.',
          });
        }
  
        // Save the user to the database
        await newUser.save();
  
        res.status(201).json({
          code: 201,
          msg: 'Successfully created a new user.',
        });
      } else {
        // Must be an authentication request
        const user = await User.findOne(req.body);
        if (!user) {
          res.status(401).json({ code: 401, msg: 'Authentication failed' });
        } else {
          res.status(200).json({
            code: 200,
            msg: 'Authentication Successful',
            token: 'TEMPORARY_TOKEN',
          });
        }
      }
    } catch (error) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ code: 400, msg: 'Validation Error', errors: validationErrors });
      } else {
        // Handle other unexpected errors
        res.status(500).json({ code: 500, msg: 'Internal Server Error' });
      }
    }
  });

// Update a user
router.put('/:id', async (req, res) => {
    try {
        if (req.body._id) delete req.body._id;
        const result = await User.updateOne({
            _id: req.params.id,
        }, req.body);

        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User updated successfully' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to update user. User not found.' });
        }
    } catch (error) {
        console.error('Error during user update:', error);
        res.status(500).json({ code: 500, msg: 'Internal server error' });
    }
});

export default router;