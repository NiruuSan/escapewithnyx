const express = require('express');
const router = express.Router();
const votesController = require('../controllers/votesController');

router.get('/', votesController.getVotes);
router.post('/', votesController.createVote);

module.exports = router;
