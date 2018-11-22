package Domain

import Entity.Data.UserTable

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
trait TUser {

  //获取登录用户信息
  def GetUserByLogin(loginName: String, loginPassword: String): UserTable
}
