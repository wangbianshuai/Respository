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
      title: 'A2 Digital Solution',
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
  //base: "/${pathName}/",
  base: "/admin/",
  hash: true,
  runtimePublicPath: true,
  exportStatic: {
    htmlSuffix: true,
  },
  proxy: {
    '/api/': {
      target: 'http://localhost/asw/',
      changeOrigin: true
    }
  },
  alias: {
    UtilsCommon: path.resolve(__dirname, './src/utils-common/index.js'),
    DvaCommon: path.resolve(__dirname, './src/dva-common/index.js'),
    UseHooks: path.resolve(__dirname, './src/use-hooks/index.js'),
    Components: path.resolve(__dirname, './src/components/index.js'),
    Controls: path.resolve(__dirname, './src/controls/index.js'),
    DataActions: path.resolve(__dirname, './src/data-actions/index.js'),
    EventActions: path.resolve(__dirname, './src/event-actions/index.js'),
    PageControls: path.resolve(__dirname, './src/page-controls/index.js'),
    PageTemplates: path.resolve(__dirname, './src/page-templates/index.js'),
    Configs: path.resolve(__dirname, './src/configs/index.js'),
  }
}
