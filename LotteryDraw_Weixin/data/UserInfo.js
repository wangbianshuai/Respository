var nameList = [
  "张三",
  "李四",
  "王五",
  "马六",
  "张飞",
  "赵云",
  "关羽",
  "刘备",
]

//创建GUID
function CreateGuid() {
  var guid = ""
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
      guid += "-"
    }
  }
  return guid
}

var data = nameList.map((name) => {
  return {
    UserId: CreateGuid(),
    NickName: name,
    AvatarUrl: ""
  }
})

module.exports = {
  DataList: data
}