const mongoose = require('mongoose');

const DeliveryProofSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    productPhoto: { type: String, required: true }, // URL to image
    signature: { type: String, required: true },    // URL to image
    fileNameP: { type: String }, // e.g., "20 April 2026_p"
    fileNameS: { type: String }, // e.g., "20 April 2026_s"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryProof', DeliveryProofSchema);
