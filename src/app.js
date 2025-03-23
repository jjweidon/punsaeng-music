const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// MongoDB 로깅 설정
const logStream = fs.createWriteStream(path.join(__dirname, '..', 'mongodb.log'), { flags: 'a' });
mongoose.set('debug', (collectionName, method, query, doc) => {
    const log = `[${new Date().toISOString()}] ${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(doc)}\n`;
    logStream.write(log);
});

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


// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pungsaeng-music')
  .then(() => {
    console.log('MongoDB 연결 성공');
    
    // 매일 자정에 데이터베이스 초기화
    cron.schedule('0 0 * * *', async () => {
      try {
        // 모든 컬렉션의 데이터 삭제
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
        console.log('데이터베이스 초기화 완료');
        
        // 로그 파일에 기록
        const log = `[${new Date().toISOString()}] 데이터베이스 초기화 완료\n`;
        logStream.write(log);
      } catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
        const log = `[${new Date().toISOString()}] 데이터베이스 초기화 실패: ${error.message}\n`;
        logStream.write(log);
      }
    });
  })
  .catch(err => console.error('MongoDB 연결 실패:', err));

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