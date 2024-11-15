// server/routes/index.js
import express from 'express';
const router = express.Router();

// Exemple de route par défaut
router.get('/', (req, res) => {
  res.send('Bienvenue sur l’API!');
});

export default router;
