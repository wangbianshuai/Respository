package Utility

/**
  * Created by BianzhaiWang on 2017/1/16.
  */
class LoginRequest {
  //登录名
  var LoginName: String = ""

  //登录密码
  var LoginPassword: String = ""

  var UserList: List[UserInfo] = null

  var UserTypes: Array[Int] = null
}
