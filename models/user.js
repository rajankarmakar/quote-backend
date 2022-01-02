const config = require( 'config' );
const Joi = require( 'joi' );
const jwt = require( 'jsonwebtoken' );
const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },
    avatar: {
        type: String,
        default: 'https://unsplash.com/photos/KLSPw4TTXSY'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { 
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin
        }, 
        config.get( 'jwtPrivateKey' )
    );
    return token;
};

const User = mongoose.model( 'User', userSchema );

function validateUser( user ) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(1024).required()
    });

    return schema.validate( user );
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;