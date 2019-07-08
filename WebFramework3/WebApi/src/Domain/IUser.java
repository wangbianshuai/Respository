package Domain;

import Entity.Data.UserTable;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public interface IUser {

    //获取登录用户信息
    UserTable GetUserByLogin(String loignName,String loginPassword);

    //更新登录时间
    boolean UpdateLoginDate(String userId);
}
