const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// MongoDB 디버그 모드 설정 (콘솔 로깅만 사용)
mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`[${new Date().toISOString()}] ${collectionName}.${method}`, {
        query,
        doc
    });
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('이미 MongoDB에 연결되어 있습니다.');
        return;
    }

    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI가 설정되지 않았습니다.');
        }

        console.log('MongoDB 연결 시도 중...');
        console.log('연결 URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // 보안을 위해 자격 증명 숨김

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            minPoolSize: 1,
        });

        // 연결 성공 이벤트 리스너
        mongoose.connection.on('connected', () => {
            console.log('MongoDB 연결 성공');
            isConnected = true;
        });

        // 연결 에러 이벤트 리스너
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB 연결 에러:', err);
            isConnected = false;
        });

        // 연결 종료 이벤트 리스너
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB 연결 종료');
            isConnected = false;
        });

        // 매일 자정에 데이터베이스 초기화
        cron.schedule('0 0 * * *', async () => {
            try {
                const collections = await mongoose.connection.db.collections();
                for (const collection of collections) {
                    await collection.deleteMany({});
                }
                console.log('데이터베이스 초기화 완료');
            } catch (error) {
                console.error('데이터베이스 초기화 중 오류 발생:', error);
            }
        });

    } catch (error) {
        console.error('MongoDB 연결 실패:', error);
        isConnected = false;
        throw error;
    }
};

// API 요청 처리 전에 DB 연결 확인
app.use('/api/*', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('API 요청 처리 중 DB 연결 실패:', error);
        res.status(500).json({
            error: '데이터베이스 연결 오류',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 라우터 설정
const requestsRouter = require('./routes/requests');
app.use('/api/requests', requestsRouter);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// favicon 라우트
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'favicon.ico'));
});

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 에러:', err);
    res.status(500).json({
        error: '서버 오류가 발생했습니다.',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
} 