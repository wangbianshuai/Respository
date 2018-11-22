package Data

import Entity.Data.UserTable

/**
  * Created by BianzhaiWang on 2017/1/19.
  */
class User extends BaseData {

  this.Init()


  def Init(): Unit = {
    this.TableName = "t_d_User"
    this.PrimaryKey = "UserId"
  }

  // 获取登录用户
  def GetLoginUser(loginName: String, loginPassword: String): UserTable = {
    val selectFieldList = List("UserId", "UserName", "LoginName", "CreateTime")

    var whereNameValues = Map[String, Any]()
    whereNameValues += ("LoginName" -> loginName)
    whereNameValues.+=("LoginPassword" -> loginPassword)

    return this.SelectEntity[UserTable](classOf[UserTable], selectFieldList, whereNameValues)
  }
}
