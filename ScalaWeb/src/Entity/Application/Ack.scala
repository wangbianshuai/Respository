package Entity.Application

import Utility.Common

/**
  * Created by Bianshuai on 2017/1/18.
  */
class Ack {

  //ID
  var Id: String = Common.CreateGuid()

  // 是否成功
  var IsSuccess: Boolean = true

  //状态编号
  var StatusCode: Int = 0

  // 信息
  var Message: String = ""
}
