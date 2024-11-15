// server/routes/messages.js
const express = require('express');
const router = express.Router();

// Ajoutez ici les routes pour les messages
router.get('/', (req, res) => {
  res.send('Bienvenue sur l’API des messages!');
});

export default router;  // Utilisez une exportation par défaut
