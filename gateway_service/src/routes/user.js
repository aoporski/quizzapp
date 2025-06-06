const express = require("express");
const router = express.Router();
const createProxy = require("../utils/httpProxy");
const verifyToken = require("../middlwares/keycloakToken");

router.use("/", ...createProxy("http://user:3002/api/user"));
module.exports = router;
