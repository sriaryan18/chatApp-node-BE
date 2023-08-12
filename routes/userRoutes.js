const {
    findAllUsers,
    getConnections, 
    addNewUser,
    checkUserName,
    login
} = require('../controllers/userController');
const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleWare');


const router=express.Router();

// router.use(authenticateJWT);

router.route('/').get(authenticateJWT,findAllUsers);
router.route('/get-connections').get(authenticateJWT,getConnections);
router.route('/register').post(addNewUser);
router.route('/checkUserName').get(checkUserName);
router.route('/login').post(login)


module.exports= router;