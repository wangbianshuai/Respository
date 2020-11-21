module.exports = {
  name: "index",
  type: "View",
  className: 'divView3',
  isDiv: true,
  properties: [getTitleView(),
   {
    name: 'myqrcode',
    type: 'MyQrCode'
  }
  ]
}

function getTitleView() {
  return {
    name: 'title',
    type: 'NavBar',
    mode: 'mark',
    className: "divNavBar",
    text: '我的二维码'
  }
}