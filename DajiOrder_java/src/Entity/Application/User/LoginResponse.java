package Entity.Application.User;

import Entity.Application.IResponse;
import Entity.Application.Response;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class LoginResponse extends Response implements IResponse {

    //用户ID
    public String UserId = null;

    //登录名
    public String LoginName = null;

    //用户名
    public String UserName = null;
}
