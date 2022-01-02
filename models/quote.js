const { categorySchema } = require( './category' );
const Joi = require( 'joi' );
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quote: {
        type: String,
        minlength: 10,
        maxlength: 1024,
        trim: true,
        required: true
    },
    category: [categorySchema],
    author: {
        type: userSchema,
        required: true
    } 
});