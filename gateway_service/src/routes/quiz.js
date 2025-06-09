const express = require("express");
const router = express.Router();
// const quizProxy = require("../utils/quizProxy");
// const questionProxy = require("../utils/questionProxy");
const createProxy = require("../utils/httpProxy");

const verifyToken = require("../middlwares/keycloakToken");

router.use("/api/quiz", ...createProxy("http://quiz:3003/api/quiz"));
router.use("/api/question", ...createProxy("http://quiz:3003/api/question"));

module.exports = router;
