const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { configs } = require("../configs/secrets");

// Twilio Credentials/Approvals 
const accountSid = configs.accountSid;
const authToken = configs.authToken;
const client = twilio(accountSid, authToken);

router.post("/sendWhatsapp", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const message = `לקוח חדש רוצה פרטים:\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}`;

        await client.messages.create({
            from: `whatsapp:${configs.fromWA}`, // Twilio WhatsApp Number

            to: `whatsapp:${configs.toWA}`,  // my WhatsApp Number
            body: message
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
