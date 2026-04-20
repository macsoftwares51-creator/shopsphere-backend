const express = require('express');
const router = express.Router();
const DeliveryProof = require('../models/DeliveryProof');

router.post('/submit-proof', async (req, res) => {
    const { orderId, productImg, signatureImg } = req.body;

    // Custom Naming Logic
    const date = new Date();
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    const nameP = `${formattedDate}_p`;
    const nameS = `${formattedDate}_s`;

    try {
        const newProof = new DeliveryProof({
            orderId,
            productPhoto: productImg, // Assuming Base64 or URL
            signature: signatureImg,
            fileNameP: nameP,
            fileNameS: nameS
        });

        await newProof.save();
        res.status(200).json({ success: true, message: "Proof Saved as " + nameP });
    } catch (err) {
        res.status(500).json({ error: "Storage Error" });
    }
});

module.exports = router;
