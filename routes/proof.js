const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const DeliveryProof = require('../models/DeliveryProof');

router.post('/submit-proof', async (req, res) => {
    const { orderId, productId, customerName, deliveryCode, signatureImg } = req.body;

    if (!orderId || !productId || !customerName || !deliveryCode || !signatureImg) {
        return res.status(400).json({ error: "All validation parameters must be populated." });
    }

    const date = new Date();
    const formattedDate = `${date.getDate()}_${date.toLocaleString('default', { month: 'long' })}_${date.getFullYear()}`;
    const nameS = `${orderId}_${customerName.replace(/\s+/g, '_')}_${formattedDate}_s`;

    try {
        // Upload signature map image directly to Cloudinary
        const uploadedSignature = await cloudinary.uploader.upload(signatureImg, {
            folder: "shopsphere_signatures",
            public_id: nameS
        });

        // Inject fields directly into your MongoDB cluster mapping schema document row
        const newProof = new DeliveryProof({
            orderId,
            productId,
            customerName,
            deliveryCode,
            signature: uploadedSignature.secure_url, // Stored securely as Cloudinary absolute URL link string
            fileNameS: nameS
        });

        await newProof.save();
        res.status(200).json({ success: true, message: nameS });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database transaction mapping failure." });
    }
});
// GET Route to return all proofs for tracking dashboard
router.get('/all-proofs', async (req, res) => {
    try {
        // Fetch all documents from MongoDB and sort so newest are at the top
        const allProofs = await DeliveryProof.find().sort({ createdAt: -1 });
        res.status(200).json(allProofs);
    } catch (err) {
        console.error("Failed to query archive database collection:", err);
        res.status(500).json({ error: "Internal ledger processing error." });
    }
});
// DELETE Route to remove a specific delivery record by ID
router.delete('/delete-proof/:id', async (req, res) => {
    try {
        const deletedProof = await DeliveryProof.findByIdAndDelete(req.params.id);
        
        if (!deletedProof) {
            return res.status(404).json({ error: "Record not found inside database ledger." });
        }
        
        res.status(200).json({ message: "Delivery proof deleted successfully." });
    } catch (err) {
        console.error("Failed to execute delete query on collection:", err);
        res.status(500).json({ error: "Internal ledger processing error." });
    }
});
module.exports = router;
