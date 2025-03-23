const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 모든 신청 목록 조회
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 새로운 신청 생성
router.post('/', async (req, res) => {
    const request = new Request({
        title: req.body.title,
        artist: req.body.artist,
        reason: req.body.reason
    });

    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 