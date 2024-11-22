const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuration de la base de données
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function createAdmin(username, password) {
  try {
    // Vérifie si un admin existe déjà
    const [existingAdmin] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (existingAdmin.length > 0) {
      console.log('Error: Admin user already exists.');
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la base de données
    await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit();
  }
}

// Récupère les arguments depuis la ligne de commande
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('Usage: node createAdmin.js <username> <password>');
  process.exit(1);
}

// Crée l'admin
createAdmin(username, password);
