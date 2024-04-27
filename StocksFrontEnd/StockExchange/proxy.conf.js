const proxyConfig = {
    "/api": {
      "target": "https://localhost:7015",
      "secure": false,
      "changeOrigin": true,
      
      "pathRewrite": {
        "^/api": ""  // Remove the /course prefix from the proxied request
      }
    }
  };
  
  module.exports = proxyConfig;