const { getNotifications } = require('../controllers/notificationController');
const { authenticateJWT } = require('../middleware/authMiddleWare');

const router = require('express').Router();


router.use(authenticateJWT);
router.route('/get-notifications').get(getNotifications);



module.exports = router;