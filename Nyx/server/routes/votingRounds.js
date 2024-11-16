import express from 'express';
import { getVotingRounds, createVotingRound } from '../controllers/votingRoundsController.js';

const router = express.Router();

router.get('/', getVotingRounds);
router.post('/', createVotingRound);

export default router;