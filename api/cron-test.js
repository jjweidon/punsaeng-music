export default async function handler(req, res) {
  console.log(`[${new Date().toISOString()}] Test Cron Job: Received ${req.method} request to /api/cron-test`);
  
  // POST 요청만 허용
  if (req.method !== 'POST') {
    console.log(`[${new Date().toISOString()}] Test Cron Job: Rejected ${req.method} request`);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Test Cron Job: Successfully executed`);
    
    return res.status(200).json({ 
      message: 'Test cron job executed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Test Cron Job failed:`, error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 