const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
    },
    resource: {
        type: String,
    },
    resourceId: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
}, 
    { timestamps: true}
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;