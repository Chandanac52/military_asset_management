const AuditLog = require('../models/AuditLog');

const auditLogger = (req, res, next) => {
  const oldSend = res.send;
  
  res.send = function(data) {
   
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const auditData = {
        userId: req.user?._id,
        action: req.method,
        resource: req.route?.path || req.originalUrl,
        resourceId: req.params?.id,
        newValues: req.body,
        timestamp: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress
      };

    
      AuditLog.create(auditData).catch(console.error);
    }
    
    oldSend.apply(res, arguments);
  };
  
  next();
};

module.exports = auditLogger;