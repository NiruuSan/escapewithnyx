const express = require('express');
const router = express.Router();
const votingOptionsController = require('../controllers/votingOptionsController');

router.get('/', votingOptionsController.getVotingOptions);
router.post('/', votingOptionsController.createVotingOption);

module.exports = router;
