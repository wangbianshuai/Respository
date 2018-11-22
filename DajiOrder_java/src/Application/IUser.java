package Application;

import Entity.Application.User.LoginRequest;
import Entity.Application.User.LoginResponse;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public interface IUser {

    //登录
    LoginResponse Login (LoginRequest request);
}
