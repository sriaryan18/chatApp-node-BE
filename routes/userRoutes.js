const {
    findAllUsers,
    getConnections, 
    addNewUser,
    checkUserName,
    login,
    getNotifications
} = require('../controllers/userController');
const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleWare');
const notificationRotes = require('../routes/notificationsRoutes')

const router=express.Router();  
router.route('/').get(authenticateJWT,findAllUsers);
router.route('/get-connections').get(authenticateJWT,getConnections);
router.route('/register').post(addNewUser);
router.route('/checkUserName').get(checkUserName);
router.route('/login').post(login);


router.use('/notifications',notificationRotes);


module.exports= router;