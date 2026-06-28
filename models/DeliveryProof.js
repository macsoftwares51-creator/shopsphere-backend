const mongoose = require('mongoose');

const DeliveryProofSchema = new mongoose.Schema({
    orderId: { type: String, required: true, index: true },
    productId: { type: String, required: true },       // Bound searchable item ID reference string
    customerName: { type: String, required: true },    // Stored verification customer signature target
    deliveryCode: { type: String, required: true },    // Protection/Verification validation code factor
    signature: { type: String, required: true },       // Secure Cloudinary tracking web URL string
    fileNameS: { type: String },                       // Label context naming marker: "OrderID_CustomerName_Date_s"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryProof', DeliveryProofSchema);
