const express = require("express");
const router = express.Router();
const proxy = require("../utils/httpProxy");

router.use("/", proxy("http://quizzapp-quiz:3003", { "^/api/quiz": "" }));

module.exports = router;
