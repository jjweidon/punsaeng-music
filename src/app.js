const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// favicon 라우트를 먼저 설정
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'favicon.ico'));
});

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '..', 'public')));

// 라우트 설정
const requestsRouter = require('./routes/requests');
app.use('/api/requests', requestsRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 