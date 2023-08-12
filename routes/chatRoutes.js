const { allMessagesById } = require('../controllers/chatController');

const router = require('express').Router();

router.route('/chat').get(allMessagesById)
