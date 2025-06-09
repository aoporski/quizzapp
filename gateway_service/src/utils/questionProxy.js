const proxy = require("express-http-proxy");
const verifyToken = require("../middlwares/keycloakToken");

function createQuestionServiceProxy(baseUrl) {
  return [
    verifyToken,
    proxy(baseUrl, {
      proxyReqPathResolver: (req) => {
        const finalPath = `/api/question${req.url}`;
        console.log(`[PROXY][QUESTION] 🚀 Forwarding: ${finalPath}`);
        return finalPath;
      },

      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const token = srcReq.headers.authorization;
        const userId = srcReq.user?.keycloakId;

        if (token) proxyReqOpts.headers["Authorization"] = token;
        if (userId) proxyReqOpts.headers["x-user-id"] = userId;

        return proxyReqOpts;
      },

      userResDecorator: async (proxyRes, proxyResData, req, res) => {
        if (proxyRes.headers["content-type"]?.includes("text/html")) {
          console.warn(`[PROXY][QUESTION] ⚠️ Received HTML instead of JSON`);
          res.status(502);
          return { message: "Invalid proxy response" };
        }

        return proxyResData;
      },
    }),
  ];
}

module.exports = createQuestionServiceProxy;
