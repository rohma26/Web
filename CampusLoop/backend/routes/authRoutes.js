// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    
    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    // 2. Check if user exists, or create one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, picture, googleId: sub });
    }

    // 3. Create YOUR App Token (JWT)
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ 
      token: appToken, 
      user: { name: user.name, email: user.email, picture: user.picture } 
    });

  } catch (error) {
    res.status(400).json({ message: "Google Auth Failed" });
  }
});

module.exports = router;