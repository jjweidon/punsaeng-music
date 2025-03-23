import { connectDB } from '../src/config/database.js';
import Request from '../src/models/Request.js';

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // MongoDB 연결
    await connectDB();
    
    // 데이터 초기화
    await Request.deleteMany({});
    
    console.log('Database initialized successfully at:', new Date().toISOString());
    
    return res.status(200).json({ 
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 