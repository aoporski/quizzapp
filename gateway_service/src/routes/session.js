const express = require("express");
const router = express.Router();
const proxy = require("../utils/httpProxy");

router.use("/", proxy("http://quizzapp-session:3004", { "^/api/session": "" }));

module.exports = router;
