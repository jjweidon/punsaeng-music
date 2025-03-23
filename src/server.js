const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/pungsaeng-music', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 노래 신청 스키마
const SongRequestSchema = new mongoose.Schema({
    title: String,
    artist: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
});

const SongRequest = mongoose.model('SongRequest', SongRequestSchema);

// API 엔드포인트
// 노래 신청 목록 조회
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await SongRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 새로운 노래 신청
app.post('/api/requests', async (req, res) => {
    try {
        const newRequest = new SongRequest(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 