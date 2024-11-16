import db from '../config/db.js';

export const getVotes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM votes ORDER BY timestamp');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching votes:", error);
        res.status(500).json({ error: "Failed to fetch votes" });
    }
};

export const createVote = async (req, res) => {
    const { wallet_address, option_id } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO votes (wallet_address, option_id) VALUES (?, ?)',
            [wallet_address, option_id]
        );
        res.status(201).json({ message: 'Vote added', voteId: result.insertId });
    } catch (error) {
        console.error("Error creating vote:", error);
        res.status(500).json({ error: "Failed to create vote" });
    }
};
