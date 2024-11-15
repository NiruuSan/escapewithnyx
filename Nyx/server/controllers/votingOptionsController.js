exports.getVotingOptions = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM votingoptions');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching voting options:", error);
        res.status(500).json({ error: "Failed to fetch voting options" });
    }
};

exports.createVotingOption = async (req, res) => {
    const { message_id, option_text } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO votingoptions (message_id, option_text) VALUES (?, ?)',
            [message_id, option_text]
        );
        res.status(201).json({ message: 'Voting option created', optionId: result.insertId });
    } catch (error) {
        console.error("Error creating voting option:", error);
        res.status(500).json({ error: "Failed to create voting option" });
    }
};
