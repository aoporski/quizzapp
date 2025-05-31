const express = require("express");
const router = express.Router();
const { register, login, loginWithGoogle } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/google", loginWithGoogle);
module.exports = router;
