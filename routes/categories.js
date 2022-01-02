const { Category, validate } = require( '../models/category' );
const auth = require( '../middleware/auth' );
const admin = require( '../middleware/admin' );
const router = require( 'express' ).Router();

router.get('/', async (req, res) => {
    const categories = await Category.find().limit(10);
    res.send( categories );
});

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate( req.body );
    if ( error ) return res.status(400).send(error.details[0].message);

    const category = new Category({ name: req.body.name });
    await category.save();

    res.send(category);
});

router.put('/:id', [auth, admin], async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    if ( ! category ) return res.status(400).send('Invalid category');

    const { error } = validate( req.body );
    if ( error ) res.status(400).send(error.details[0].message);

    category.set({
        name: req.body.name
    });

    const result = await category.save();
    res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const category = await Category.deleteOne({ _id: req.params.id });
    if ( ! category ) return res.status(400).send('Invalid category');

    res.send(category);
});

module.exports = router;