import db from '../config/db.js';

// Récupérer tous les tours de vote
export const getVotingRounds = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM votingrounds');
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des tours de vote:", error);
    res.status(500).json({ error: "Impossible de récupérer les tours de vote." });
  }
};

// Créer un nouveau tour de vote
export const createVotingRound = async (req, res) => {
  const { message_id } = req.body;

  if (!message_id) {
    return res.status(400).json({ error: "L'identifiant du message est requis pour créer un tour de vote." });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO votingrounds (message_id, status) VALUES (?, "open")',
      [message_id]
    );

    res.status(201).json({
      message: "Nouveau tour de vote créé avec succès.",
      roundId: result.insertId,
    });
  } catch (error) {
    console.error("Erreur lors de la création du tour de vote:", error);
    res.status(500).json({ error: "Impossible de créer le tour de vote." });
  }
};

// Fermer un tour de vote
export const closeVotingRound = async (req, res) => {
  const { roundId, selectedOptionId } = req.body;

  if (!roundId || !selectedOptionId) {
    return res.status(400).json({ error: "L'identifiant du tour de vote et l'option sélectionnée sont requis." });
  }

  try {
    await db.query(
      'UPDATE votingrounds SET status = "closed", selected_option_id = ? WHERE id = ?',
      [selectedOptionId, roundId]
    );
    res.json({ message: "Tour de vote fermé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la fermeture du tour de vote:", error);
    res.status(500).json({ error: "Impossible de fermer le tour de vote." });
  }
};
