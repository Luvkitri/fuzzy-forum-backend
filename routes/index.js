const router = require('express').Router();

router.use('/entries', require('./entries'));
router.use('/threads', require('./threads'));
router.use('/users', require('./users'));
router.use('/answers', require('./answers'));

module.exports = router;
