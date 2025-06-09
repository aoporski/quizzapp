const express = require("express");
const router = express.Router();
const createProxy = require("../utils/httpProxy");

router.use("/", ...createProxy("http://session:3004/api/session"));
module.exports = router;
