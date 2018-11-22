package Entity.Application.User;

import Entity.Application.IRequest;
import Entity.Application.Request;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class LoginRequest extends Request implements IRequest {

    //登录名
    public String LoginName = null;

    //登录密码
    public String LoginPassword = null;
}
