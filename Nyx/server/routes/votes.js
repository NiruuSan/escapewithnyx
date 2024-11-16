import express from 'express';
import { getVotes, createVote } from '../controllers/votesController.js';

const router = express.Router();

router.get('/', getVotes);
router.post('/', createVote);

export default router;