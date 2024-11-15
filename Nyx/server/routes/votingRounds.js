const express = require('express');
const router = express.Router();
const votingRoundsController = require('../controllers/votingRoundsController');

router.get('/', votingRoundsController.getVotingRounds);
router.post('/', votingRoundsController.createVotingRound);

module.exports = router;
