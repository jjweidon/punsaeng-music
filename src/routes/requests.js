const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 모든 신청 목록 조회
router.get('/', (req, res) => {
    db.all('SELECT * FROM requests ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        res.json(rows);
    });
});

// 새로운 신청 생성
router.post('/', (req, res) => {
    const { title, artist, reason } = req.body;
    
    db.run(
        'INSERT INTO requests (title, artist, reason) VALUES (?, ?, ?)',
        [title, artist, reason],
        function(err) {
            if (err) {
                res.status(400).json({ message: err.message });
                return;
            }
            res.status(201).json({
                id: this.lastID,
                title,
                artist,
                reason,
                createdAt: new Date().toISOString()
            });
        }
    );
});

module.exports = router; 