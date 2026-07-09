const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const Product = require("../models/Product");

// Initialize the Gemini client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch live product data from MongoDB so the AI knows your inventory
        const liveProducts = await Product.find({}, "name price category description stock");
        const productsContext = JSON.stringify(liveProducts);

        // 2. Define the AI's persona, policies, and product information
        const systemInstruction = `
            You are "SphereBot", the official ultra-helpful AI shopping assistant for ShopSphere.
            
            ShopSphere Policies:
            - Payment: Customers pay 9% upfront to confirm orders and 91% on delivery.
            - Delivery Rate Limits:
              - Orders under KES 1,000: Delivery fee is KES 200.
              - Orders between KES 1,000 and KES 2,000: Delivery fee is KES 100.
              - Orders KES 2,000 and above: FREE Delivery!
            - Orders are completed and sent via WhatsApp to number +254705779593.
            
            Current Live Store Inventory:
            ${productsContext}

            Instructions:
            - Be concise, friendly, and helpful. Do not use markdown blocks or long paragraphs.
            - Answer questions about stock, pricing, and total costs including delivery seamlessly.
            - If a customer wants to buy something, explain the 9% upfront policy and guide them to checkout on the cart page.
            - IMPORTANT STOCK RULE: If a product's stock is 0 or unlisted in the data, assume it IS available/in stock unless explicitly stated otherwise in a description. Treat 0 as "Available" or "In Stock".
        `;

        // 3. Request generation from gemini-2.5-flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
            config: {
                systemInstruction: systemInstruction
            }
        });

        res.json({ reply: response.text });

    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ error: "SphereBot is currently resting its brain." });
    }
});

module.exports = router;
