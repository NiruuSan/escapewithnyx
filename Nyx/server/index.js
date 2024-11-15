import express from 'express';
import dotenv from 'dotenv';
import messagesRoutes from './routes/messages.js';
import votesRoutes from './routes/votes.js';
import votingOptionsRoutes from './routes/votingOptions.js';
import votingRoundsRoutes from './routes/votingRounds.js';
import db from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour traiter les JSON
app.use(express.json());

// Ajouter les routes
app.use('/api/messages', messagesRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/voting-options', votingOptionsRoutes);
app.use('/api/voting-rounds', votingRoundsRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
