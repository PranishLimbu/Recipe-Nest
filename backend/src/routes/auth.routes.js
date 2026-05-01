const express = require("express");
const admin = require("../config/firebase");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/register-chef", authController.registerChef);
router.post("/register-admin", authController.registerAdmin);
router.post("/login", authController.login);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);

    res.status(200).json({
      success: true,
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

module.exports = router;
