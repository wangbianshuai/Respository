package Data;

import Entity.Data.UserTable;
import LambdaInterface.IExceptionHandle;

import java.util.*;

/**
 * Created by BianzhaiWang on 2017/1/12.
 */
public class User extends BaseData {
    public User() {
        this.Init();
    }

    public void Init() {
        this.TableName = "t_d_User";
        this.PrimaryKey = "UserId";
    }

    public User(IExceptionHandle exHandle) {
        super(exHandle);
        this.Init();
    }

    // 获取登录用户
    public UserTable GetLoginUser(String loginName, String loginPassword) {
        List<String> selectFieldList = Arrays.asList("UserId", "UserName", "LoginName", "CreateTime");

        Map<String, Object> whereNameValues = new HashMap<>();

        whereNameValues.put("LoginName", loginName);
        whereNameValues.put("LoginPassword", loginPassword);

        return this.SelectEntity(UserTable.class, selectFieldList, whereNameValues);
    }
}
