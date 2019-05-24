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
      title: 'E贷通2.0',
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

      metas: [{ name: "msapplication-tap-highlight", content: "no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
      { "http-equiv": "Cache-Control", content: "no-cache, no-store, must-revalidate" },
      { "http-equiv": "Pragma", content: "no-cache" },
      { "http-equiv": "Expires", content: "0" }
      ]
    }],
  ],
  publicPath: "/edt/",
  base: "/edt/",
  hash: true,
  runtimePublicPath: true,
  exportStatic: {
    htmlSuffix: true,
  },
  proxy: {
    '/apih5/': {
      target: 'http://test-m.xxd.com',
      changeOrigin: true
    },
    '/userCenter/': {
      target: 'http://test-m.xxd.com',
      changeOrigin: true
    },
    '/fileCenter/': {
      target: 'http://test-m.xxd.com',
      changeOrigin: true
    },
    '/eloan/': {
      target: 'http://test-fk.xxd.com',
      changeOrigin: true
    }
  },
  alias: {
    UtilsCommon: path.resolve(__dirname, './src/utils-common/Index.js'),
    DvaCommon: path.resolve(__dirname, './src/dva-common/Index.js'),
    ReactCommon: path.resolve(__dirname, './src/react-common/Index.js'),
    Configs: path.resolve(__dirname, './src/configs/Index.js'),
    Components: path.resolve(__dirname, './src/components/Index.js'),
    Controls: path.resolve(__dirname, './src/controls/Index.js'),
    Actions: path.resolve(__dirname, './src/actions/Index.js'),
    EventActions: path.resolve(__dirname, './src/event-actions/Index.js'),
    PageComponents: path.resolve(__dirname, './src/page-components/Index.js'),
    PageControls: path.resolve(__dirname, './src/page-controls/Index.js'),
    JsBridge: path.resolve(__dirname, './src/js-bridge/Index.js')
  }
}
