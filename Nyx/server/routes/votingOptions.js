import express from 'express';
import { getVotingOptions, createVotingOption } from '../controllers/votingOptionsController.js';

const router = express.Router();

router.get('/', getVotingOptions);
router.post('/', createVotingOption);

export default router;