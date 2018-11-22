package Entity.Application.User

import Entity.Application.Request

/**
  * Created by Bianshuai on 2017/1/18.
  */
class LoginRequest extends Request {
  //登录名
  var LoginName: String = null

  //登录密码
  var LoginPassword: String = null
}
