package WebApi.Actions;

import Entity.Application.User.LoginRequest;
import Utility.JsonParse;
import jdk.nashorn.api.scripting.JSObject;
import org.jetbrains.annotations.NotNull;
import sun.rmi.runtime.Log;

import java.io.IOException;
import java.util.Collection;
import java.util.Set;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class User extends  BaseAction implements IAction{

    Application.IUser _user = null;

    public User() {
        _user = new Application.Impl.User();
    }

    public  Object login(@NotNull Request request) throws Exception {
        LoginRequest entity = JsonParse.JsonTo(LoginRequest.class, request.RequestContent);
        return _user.Login(entity);
    }
}
