const db = require('../config/db');

exports.getMessages = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM messages ORDER BY timestamp');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

exports.createMessage = async (req, res) => {
    const { sender, content, response_to } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO messages (sender, content, response_to) VALUES (?, ?, ?)',
            [sender, content, response_to]
        );
        res.status(201).json({ message: 'Message created', messageId: result.insertId });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Failed to create message" });
    }
};
