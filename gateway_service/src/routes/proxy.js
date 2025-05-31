const express = require("express");
const router = express.Router();
const proxy = require("../utils/httpProxy");

router.use("/", proxy("http://user-service:3002"));

module.exports = router;
