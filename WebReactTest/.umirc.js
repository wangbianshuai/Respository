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
      title: '消息管理系统',
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
  publicPath: "/",
  base: "/",
  hash: true,
  runtimePublicPath: true,
  exportStatic: {
    htmlSuffix: true,
  },
  proxy: {
    '/web/': {
      target: 'http://localhost:50152/',
      changeOrigin: true
    },
    '/api/': {
      target: 'http://localhost:50152/',
      changeOrigin: true
    }
  },
  alias: {
    UtilsCommon: path.resolve(__dirname, './src/utils-common/Index.js'),
    DvaCommon: path.resolve(__dirname, './src/dva-common/Index.js'),
    ReactCommon: path.resolve(__dirname, './src/react-common/Index.js'),
    Components: path.resolve(__dirname, './src/components/Index.js'),
    Controls: path.resolve(__dirname, './src/controls/Index.js'),
    Actions: path.resolve(__dirname, './src/actions/Index.js'),
    EventActions: path.resolve(__dirname, './src/event-actions/Index.js'),
    PageControls: path.resolve(__dirname, './src/page-controls/Index.js'),
    PageTemplates: path.resolve(__dirname, './src/page-templates/Index.js'),
    ModelsConfigs: path.resolve(__dirname, './src/models-configs/Index.js')
  }
}
