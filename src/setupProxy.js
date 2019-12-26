const proxy = require("http-proxy-middleware");
const isDev = process.env.NODE_ENV === "development";
const BASE_URL = isDev
  ? "http://127.0.0.1:8888"
  : "http://138.128.211.146:8888";


module.exports = app => {
  app.use(
    proxy("/api", {
      target: BASE_URL,
      pathRewrite: {
        "^/api": "",
      },
      changeOrigin: true,
    })
  );
};



