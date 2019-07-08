package Domain.Impl;

import Domain.IUser;
import Entity.Data.UserTable;
import LambdaInterface.IExceptionHandle;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class User extends BaseDomain implements IUser {
    Data.User _user = null;

    public User() {
        _user = new Data.User();
    }

    public User(IExceptionHandle exHandle) {
        super(exHandle);
        _user = new Data.User(exHandle);
    }

    //获取登录用户信息
    public UserTable GetUserByLogin(String loignName, String loginPassword) {
        return _user.GetLoginUser(loignName, loginPassword);
    }

    //更新登录时间
    public boolean UpdateLoginDate(String userId) {
        return _user.UpdateLoginDate(userId);
    }
}