package Application

import Entity.Application.User.{LoginRequest, LoginResponse}

/**
  * Created by Bianshuai on 2017/1/18.
  */
trait TUser {
  //登录
  def Login(request: LoginRequest): LoginResponse
}
