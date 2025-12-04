/**
 * Middleware to protect admin routes
 * Requires x-admin-key header to match ADMIN_SECRET_KEY in .env
 */

const adminAuth = (req, res, next) => {
  // Lấy admin key từ request header
  const adminKey = req.headers['x-admin-key'];
  
  // Kiểm tra có admin key không
  if (!adminKey) {
    return res.status(401).json({ 
      success: false, 
      message: 'Admin key is required' 
    });
  }
  
  // Kiểm tra admin key có đúng không
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid admin key' 
    });
  }
  
  // Nếu đúng, cho phép tiếp tục
  next();
};

module.exports = adminAuth;