const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Twilio Credentials (Replace with your real credentials)
const accountSid = "AC68ef1082c242500e4535903210a45660";
const authToken = "22d5f54cc136e5e82cfbb8e1233a8ccd";
const client = twilio(accountSid, authToken);

router.post("/sendWhatsapp", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const message = `לקוח חדש רוצה פרטים:\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}`;

        await client.messages.create({
            from: "whatsapp:+14155238886", // Twilio WhatsApp Number
            to: "whatsapp:+972539313477",  // Your WhatsApp Number
            body: message
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
