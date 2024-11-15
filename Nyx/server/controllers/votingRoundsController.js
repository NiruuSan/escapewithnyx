exports.getVotingRounds = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM votingrounds');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching voting rounds:", error);
        res.status(500).json({ error: "Failed to fetch voting rounds" });
    }
};

exports.createVotingRound = async (req, res) => {
    const { message_id, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO votingrounds (message_id, status) VALUES (?, ?)',
            [message_id, status]
        );
        res.status(201).json({ message: 'Voting round created', roundId: result.insertId });
    } catch (error) {
        console.error("Error creating voting round:", error);
        res.status(500).json({ error: "Failed to create voting round" });
    }
};
