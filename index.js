const quotes = require( './routes/quotes' );
const categories = require( './routes/categories' );
const auth = require( './routes/auth' );
const users = require( './routes/users' );
const mongoose = require( 'mongoose' );
const express = require( 'express' );
const config = require('config');
const app = express();

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

mongoose.connect( config.get( 'mongoUri' ) )
    .then( () => console.log( 'Mongodb connected' ) )
    .catch( ( err ) => console.log( err ) );

app.use( '/api/users', users );
app.use( '/api/auth', auth );
app.use( '/api/categories', categories );

app.listen( 5000, () => console.log( 'App is listening on port http://localhost:5000' ) );

