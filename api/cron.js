import { connectDB } from '../src/config/database.js';
import Request from '../src/models/Request.js';

export default async function handler(req, res) {
  const startTime = new Date().toISOString();
  console.log(`[${startTime}] Starting database cleanup cron job`);
  
  // POST 요청만 허용
  if (req.method !== 'POST') {
    console.log(`[${new Date().toISOString()}] Rejected ${req.method} request`);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Attempting to connect to MongoDB...`);
    // MongoDB 연결
    await connectDB();
    console.log(`[${new Date().toISOString()}] Successfully connected to MongoDB`);
    
    // 데이터 초기화
    console.log(`[${new Date().toISOString()}] Starting database cleanup...`);
    const result = await Request.deleteMany({});
    console.log(`[${new Date().toISOString()}] Database cleanup completed. Deleted ${result.deletedCount} documents`);
    
    const endTime = new Date().toISOString();
    const duration = new Date(endTime) - new Date(startTime);
    console.log(`[${endTime}] Cron job completed successfully. Duration: ${duration}ms`);
    
    return res.status(200).json({ 
      message: 'Database initialized successfully',
      timestamp: endTime,
      deletedCount: result.deletedCount,
      duration: `${duration}ms`
    });
  } catch (error) {
    const errorTime = new Date().toISOString();
    console.error(`[${errorTime}] Cron job failed:`, error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      timestamp: errorTime
    });
  }
} 