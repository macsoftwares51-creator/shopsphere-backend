const mongoose = require('mongoose');

const DeliveryProofSchema = new mongoose.Schema({
    orderId: { type: String, required: true, index: true },
    productPhoto: { type: String, required: true }, // Stores secure Cloudinary asset URL
    signature: { type: String, required: true },    // Stores secure signature link entry
    fileNameP: { type: String }, // Format reference: "OrderID_Date_p"
    fileNameS: { type: String }, // Format reference: "OrderID_Date_s"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryProof', DeliveryProofSchema);
