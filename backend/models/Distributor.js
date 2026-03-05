const mongoose = require('mongoose');

const DistributorSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Distributor', DistributorSchema);