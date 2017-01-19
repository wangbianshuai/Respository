package Domain.Impl

import Domain.TUser
import Entity.Data.UserTable

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
class User extends TUser {

  val _user = new Data.User()

  //获取登录用户信息
  override def GetUserByLogin(loginName: String, loginPassword: String): UserTable = {
    return _user.GetLoginUser(loginName, loginPassword)
  }
}
