const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2; // Keep image data lightweight
const DeliveryProof = require('../models/DeliveryProof');

// Standard verification layer backup mapping
router.post('/submit-proof', async (req, res) => {
    const { orderId, productImg, signatureImg } = req.body;

    if (!orderId || !productImg || !signatureImg) {
        return res.status(400).json({ error: "Missing required tracking parameters." });
    }

    // Custom Named Asset Strings
    const date = new Date();
    const formattedDate = `${date.getDate()}_${date.toLocaleString('default', { month: 'long' })}_${date.getFullYear()}`;
    const nameP = `${orderId}_${formattedDate}_p`;
    const nameS = `${orderId}_${formattedDate}_s`;

    try {
        // 1. Upload the high-res base64 item snapshot image to Cloudinary asset servers
        const uploadedPhoto = await cloudinary.uploader.upload(productImg, {
            folder: "shopsphere_proofs",
            public_id: nameP
        });

        // 2. Upload the canvas electronic signature mapping
        const uploadedSignature = await cloudinary.uploader.upload(signatureImg, {
            folder: "shopsphere_signatures",
            public_id: nameS
        });

        // 3. Save clean tracking URLs directly inside your cluster database document row maps
        const newProof = new DeliveryProof({
            orderId,
            productPhoto: uploadedPhoto.secure_url, // Clean remote asset URL scheme
            signature: uploadedSignature.secure_url, // Clean signature image map
            fileNameP: nameP,
            fileNameS: nameS
        });

        await newProof.save();
        res.status(200).json({ success: true, message: nameP });
    } catch (err) {
        console.error("Cloudinary database storage failure trace:", err);
        res.status(500).json({ error: "Storage node integration failed." });
    }
});

module.exports = router;
