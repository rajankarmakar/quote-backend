const auth = require( '../middleware/auth' );
const admin = require( '../middleware/admin' );
const bcrypt = require( 'bcrypt' );
const { User, validate } = require( '../models/user' );
const router = require( 'express' ).Router();

router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find().select('-password').limit(10);
    res.send(users);
});

router.post('/me', auth, async (req, res) => {
    const user = await User.findById({ _id: req.user._id }).select('-password');
    if ( ! user ) res.status(400).send('Invalid user');

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate( req.body );
    if ( error ) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if ( user ) return res.status(400).send('User already exist');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( user.password, salt );
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
        _id: user.id,
        name: user.name,
        email: user.email
    });
});

router.put('/:id', [auth], async (req, res) => {
    let user = await User.findById({ _id: req.params.id });
    if ( ! user ) return res.status(404).send('User not found');

    if ( ( req.params.id !== user._id ) && ( false === req.user.isAdmin ) ) {
        return res.status(404).send('You do not have permission to update the user');
    }

    const { error } = validate( req.body );
    if ( error ) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash( req.body.password, salt );

    user.set({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });

    const result = await user.save();
    res.send({
        _id: result._id,
        name: result.name,
        email: result.email
    });
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.deleteOne({ _id: req.params.id });
    if ( ! user ) res.status(400).send('Invalid user');

    res.send(user);
});

module.exports = router;