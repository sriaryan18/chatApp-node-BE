const { getMessages } = require('../controllers/chatController');
const { authenticateJWT } = require('../middleware/authMiddleWare');

const router = require('express').Router();
router.use(authenticateJWT);
router.route('/').get(getMessages);

module.exports = router;

