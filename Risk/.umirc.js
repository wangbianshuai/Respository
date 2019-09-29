const path = require('path');
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: '风控审批系统',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  publicPath: "/risk/",
  base: "/risk/",
  hash: true,
  runtimePublicPath: true,
  exportStatic: {
    htmlSuffix: true,
  },
  proxy: {
    '/userCenter/': {
      target: 'http://stage.xxd.com',
      changeOrigin: true
    },
    // '/RiskControlApproval/': {
    //   target: 'http://stage.xxd.com',
    //   changeOrigin: true
    // },
    "/LoanApplyPlatform/": {
      target: 'http://stage.xxd.com',
      changeOrigin: true
    },
    "/anti-fraud/": {
      target: 'http://dev.xxd.com',
      changeOrigin: true
    },
    // "/auth/": {
    //   target: 'http://stage-g.xxd.com',
    //   changeOrigin: true
    // },
    // "/services/": {
    //   target: 'http://stage-g.xxd.com',
    //   changeOrigin: true
    // }
  },
  alias: {
    UtilsCommon: path.resolve(__dirname, './src/utils-common/Index.js'),
    DvaCommon: path.resolve(__dirname, './src/dva-common/Index.js'),
    ReactCommon: path.resolve(__dirname, './src/react-common/Index.js'),
    Components: path.resolve(__dirname, './src/components/Index.js'),
    Controls: path.resolve(__dirname, './src/controls/Index.js'),
    Actions: path.resolve(__dirname, './src/actions/Index.js'),
    EventActions: path.resolve(__dirname, './src/event-actions/Index.js'),
    PageControls: path.resolve(__dirname, './src/page-controls/Index.js')
  }
}
