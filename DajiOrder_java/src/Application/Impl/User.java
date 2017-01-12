package Application.Impl;
import Application.IUser;
import Entity.Application.Response;
import Entity.Application.User.LoginRequest;
import Entity.Application.User.LoginResponse;
import Entity.Data.UserTable;

import java.util.function.Supplier;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class User extends BaseAction implements IUser {

    Domain.IUser _user = null;

    public User() {
        _user = new Domain.Impl.User(this.ExceptionHandle);
        this.Name = "User";
    }

    //登录
    public LoginResponse Login(LoginRequest request) {
        LoginResponse response = new LoginResponse();
        this.InitMessage();

        if (!this.IsNullRequest(request, response)) {
            return response;
        }

        //1、获取客户信息
        int stepNo = 1;
        UserTable entity = this.GetUserByLogin(stepNo, request, response);

        this.JudgeLogin(entity, response);

        //2、执行结束
        this.ExecEnd(response);

        //日志记录
        this.SetInfoLog("Servlet服务获取登录", request.RequestContent, response, null);

        return response;
    }

    private void JudgeLogin(UserTable entity, LoginResponse response) {
        if (entity != null) {
            response.LoginName = entity.LoginName;
            response.UserId = entity.UserId;
            response.UserName = entity.UserName;
        } else {
            response.Ack.IsSuccess = false;
            response.Ack.Message = "对不起，登录名或密码不正确！";
        }
    }

    // 获取客户信息
    private UserTable GetUserByLogin(int stepNo, LoginRequest request, Response response) {
        Supplier<UserTable> execStep = () ->
        {
            return _user.GetUserByLogin(request.LoginName, request.LoginPassword);
        };

        return this.GetEntityData(UserTable.class, stepNo, "获取客户信息", "GetAccount", response, execStep, true);
    }
}
