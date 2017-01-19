package WebApi.Actions

import Application.TUser
import Entity.Application.User.LoginRequest
import Utility.JsonParse

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
class User extends BaseAction with TAction {

  var _user: TUser = new Application.Impl.User()

  def login(request: Request): Any = {
    var entity = JsonParse.JsonToEntity[LoginRequest](classOf[LoginRequest], request.RequestContent)
    return _user.Login(entity)
  }
}
