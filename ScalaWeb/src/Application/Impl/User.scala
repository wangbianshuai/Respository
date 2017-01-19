package Application.Impl

import Application.TUser
import Entity.Application.User.{LoginRequest, LoginResponse}

/**
  * Created by Bianshuai on 2017/1/18.
  */
class User extends TUser {

  val _user: Domain.TUser = new Domain.Impl.User()

  //登录
  override def Login(request: LoginRequest): LoginResponse = {
    val response = new LoginResponse()

    val entity = _user.GetUserByLogin(request.LoginName, request.LoginPassword)

    if (entity != null) {
      response.LoginName = entity.LoginName
      response.UserId = entity.UserId
      response.UserName = entity.UserName
    }
    else {
      response.Ack.IsSuccess = false
      response.Ack.Message = "对不起，登录名或密码不正确！"
    }

    return response
  }
}
