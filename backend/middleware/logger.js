const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  // Log user info if authenticated
  if (req.auth && req.auth.userId) {
    console.log(`  User: ${req.auth.userId}`);
  }

  next();
};

module.exports = logger;
