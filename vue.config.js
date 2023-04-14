const { defineConfig } = require("@vue/cli-service");

//const port = process.env.port || process.env.npm_config_port || 9528; // dev port

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // port: port,
    // open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true,
    // },
    proxy: {
      "/api": {
        // target: 'http://192.168.3.123:8086/', // 开发
        // target: 'http://tmac.test-platform.allx.cloud/', // 测试
        target: "https://localhost:7001/", // 测试
        // target: 'http://121.89.220.126:30192/', // 正式
        changeOrigin: true,
      },
      // "/server": {
      //   // target: 'http://192.168.3.123:8086/', // 开发
      //   // target: 'http://tmac.test-platform.allx.cloud/', // 测试
      //   target: "https://air.test-platform.allx.cloud/", // 测试
      //   // target: 'http://121.89.220.126:30192/', // 正式
      //   changeOrigin: true,
      // },
      // //代理websocket
      // "/websocket": {
      //   ws: true,
      //   // target: 'http://192.168.3.123:8086/', // 开发
      //   target: "https://air.test-platform.allx.cloud/", // 测试
      //   changeOrigin: true,
      // },
    },
  },
});
