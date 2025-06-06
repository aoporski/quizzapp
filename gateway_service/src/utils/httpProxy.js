const proxy = require("express-http-proxy");
const { keycloak } = require("../keycloak");
const verifyToken = require("../middlwares/keycloakToken");

function createUserServiceProxy(baseUrl) {
  return [
    verifyToken,
    proxy(baseUrl, {
      proxyReqPathResolver: (req) => {
        const finalPath = req.url;
        console.log(
          `[PROXY] 🚀 Forwarding request to user-service: ${finalPath}`
        );
        return finalPath;
      },

      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const token = srcReq.headers.authorization;
        const userId = srcReq.user?.keycloakId;
        const email = srcReq.user.email;

        console.log(`[PROXY] 🔑 Token: ${token?.substring(0, 20)}...`);
        console.log(`[PROXY] 👤 User ID from token: ${userId}`);

        if (token) proxyReqOpts.headers["Authorization"] = token;
        if (userId) proxyReqOpts.headers["x-user-id"] = userId;
        if (email) proxyReqOpts.headers["x-user-email"] = email;

        return proxyReqOpts;
      },

      userResDecorator: async (proxyRes, proxyResData, req, res) => {
        console.log(
          `[PROXY] 📦 Received response with status ${proxyRes.statusCode}`
        );

        if (proxyRes.headers["content-type"]?.includes("text/html")) {
          const htmlSnippet = proxyResData.toString().slice(0, 200); // log only a snippet
          console.warn(
            `[PROXY] ⚠️ HTML received instead of JSON: ${htmlSnippet}`
          );

          res.status(502);
          return {
            message:
              "Expected JSON, got HTML. Probably bad token or missing route.",
          };
        }

        return proxyResData;
      },
    }),
  ];
}

module.exports = createUserServiceProxy;
