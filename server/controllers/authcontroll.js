const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
    // registration logic here
};

exports.loginUser = async (req, res) => {
    // login logic here
};
const token = generateToken(user._id);