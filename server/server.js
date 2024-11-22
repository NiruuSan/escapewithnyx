const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const bcrypt = require('bcrypt');
const validator = require('validator');

dotenv.config();

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite de 5 tentatives par IP
    message: 'Too many login attempts. Please try again later.',
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());

// Configuration de la base de données
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Middleware pour gérer l'identifiant utilisateur
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Origine de votre client React
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (!req.cookies.userId) {
    const newUserId = uuidv4();
    res.cookie('userId', newUserId, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
    req.cookies.userId = newUserId;
  }
  next();
});

function checkAdminAuth(req, res, next) {
    const token = req.cookies.adminToken; // Récupère le token du cookie
    if (token === process.env.ADMIN_TOKEN) { // Compare avec le token sécurisé
      return next();
    }
    return res.status(403).json({ error: 'Unauthorized access' });
  }

// Fonction pour notifier tous les clients WebSocket des options de vote
const notifyMessages = async (newMessage = null) => {
    try {
      let data;
  
      if (newMessage) {
        // Envoie uniquement le nouveau message
        data = JSON.stringify({ type: 'messages', payload: [newMessage] });
      } else {
        // Envoie tous les messages (cas initial)
        const [messages] = await db.query('SELECT * FROM messages ORDER BY created_at ASC');
        data = JSON.stringify({ type: 'messages', payload: messages });
      }
  
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    } catch (error) {
      console.error('Error notifying messages:', error);
    }
  };

const notifyClients = async () => {
  try {
    const [options] = await db.query('SELECT * FROM votingoptions');
    const data = JSON.stringify({ type: 'votingoptions', payload: options });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  } catch (error) {
    console.error('Error notifying clients:', error);
  }
};

// WebSocket : Gestion des connexions
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running.');

app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
      // Vérifiez si l'utilisateur existe
      const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
      if (rows.length === 0) {
          return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
      }

      const admin = rows[0];

      // Comparer le mot de passe fourni avec celui de la base de données
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
      }

      // Créer un cookie adminToken pour authentification
      res.cookie('adminToken', 'authenticated', { httpOnly: true, maxAge: 3600000 });
      res.status(200).json({ message: 'Connexion réussie.' });
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});
  
  // Vérifie si l'utilisateur est admin
  app.get('/api/check-admin', (req, res) => {
    const adminToken = req.cookies.adminToken;
    if (adminToken === 'authenticated') {
        res.status(200).json({ message: 'Authenticated' });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Routes
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Ajouter un message
app.post('/api/messages', async (req, res) => {
  const { content, type } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Le contenu du message est requis.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO messages (content, type, created_at) VALUES (?, ?, NOW())',
      [content, type || 'default'] // Utilise "default" si aucun type n'est fourni
    );

    const newMessage = { id: result.insertId, content, type: type || 'default', created_at: new Date().toISOString() };
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message :', error);
    res.status(500).json({ error: 'Échec de l\'ajout du message' });
  }
});



  // Route pour la déconnexion
app.post('/api/logout', (req, res) => {
  res.clearCookie('adminToken'); // Supprime le cookie adminToken
  res.status(200).json({ message: 'Logout successful' });
}); 

app.post('/api/votingoptions', async (req, res) => {
  const { round_id, message_content } = req.body;

  if (!round_id || !message_content) {
    return res.status(400).json({ error: 'Round ID and message content are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO votingoptions (round_id, message_content, votes) VALUES (?, ?, 0)',
      [round_id, message_content]
    );

    res.status(201).json({ id: result.insertId, round_id, message_content, votes: 0 });
  } catch (error) {
    console.error('Error adding voting option:', error);
    res.status(500).json({ error: 'Failed to add voting option' });
  }
});

app.get('/api/votingoptions', async (req, res) => {
  try {
    const [activeRound] = await db.query('SELECT id FROM votingrounds WHERE status = "ongoing" LIMIT 1');
    if (activeRound.length === 0) {
      return res.json([]);
    }

    const roundId = activeRound[0].id;

    const [options] = await db.query('SELECT * FROM votingoptions WHERE round_id = ?', [roundId]);
    res.json(options);
  } catch (error) {
    console.error('Error fetching voting options:', error);
    res.status(500).json({ error: 'Failed to fetch voting options' });
  }
});

// Créer un nouveau round
app.post('/api/votingrounds', async (req, res) => {
  try {
    await db.query('UPDATE votingrounds SET status = "finished" WHERE status = "ongoing"');

    const [result] = await db.query('INSERT INTO votingrounds (status, created_at) VALUES ("ongoing", NOW())');

    const newRoundId = result.insertId;
    res.status(201).json({ id: newRoundId, status: 'ongoing' });
  } catch (error) {
    console.error('Error creating a new voting round:', error);
    res.status(500).json({ error: 'Failed to create a new voting round' });
  }
});

// Enregistrer un vote
app.post('/api/vote', async (req, res) => {
  const { optionId } = req.body;
  const userId = req.cookies.userId;

  try {
    const [activeRound] = await db.query('SELECT id FROM votingrounds WHERE status = "ongoing" LIMIT 1');
    if (activeRound.length === 0) {
      return res.status(400).json({ error: 'No active voting round' });
    }

    const roundId = activeRound[0].id;

    const [existingVote] = await db.query(
      'SELECT * FROM user_votes WHERE user_identifier = ? AND round_id = ?',
      [userId, roundId]
    );

    if (existingVote.length > 0) {
      return res.status(400).json({ error: 'You have already voted in this round.' });
    }

    await db.query(
      'INSERT INTO user_votes (user_identifier, option_id, round_id, voted_at) VALUES (?, ?, ?, NOW())',
      [userId, optionId, roundId]
    );
    await db.query('UPDATE votingoptions SET votes = votes + 1 WHERE id = ?', [optionId]);

    notifyClients();
    res.json({ message: 'Vote counted' });
  } catch (error) {
    console.error('Error handling vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Récupérer les détails du round en cours
app.get('/api/active-round', async (req, res) => {
  try {
    const [activeRound] = await db.query('SELECT id, status, created_at FROM votingrounds WHERE status = "ongoing" LIMIT 1');
    if (activeRound.length > 0) {
      res.json({ activeRound: activeRound[0] });
    } else {
      res.json({ activeRound: null });
    }
  } catch (error) {
    console.error('Error fetching active round:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fermer un round en cours
app.patch('/api/votingrounds/:id/close', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('UPDATE votingrounds SET status = "finished" WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Round not found or already closed' });
    }
    res.status(200).json({ message: 'Round closed successfully' });
  } catch (error) {
    console.error('Error closing round:', error);
    res.status(500).json({ error: 'Failed to close round' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
