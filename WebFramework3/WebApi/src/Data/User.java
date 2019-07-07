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
        this.PrimaryKey = "User_Id";
    }

    public User(IExceptionHandle exHandle) {
        super(exHandle);
        this.Init();
    }

    // 获取登录用户
    public UserTable GetLoginUser(String loginName, String loginPassword) {
        List<String> selectFieldList = Arrays.asList("User_Id", "User_Name", "Login_Name", "Login_Date");

        Map<String, Object> whereNameValues = new HashMap<>();

        whereNameValues.put("Login_Name", loginName);
        whereNameValues.put("Login_Password", loginPassword);

        return this.SelectEntity(UserTable.class, selectFieldList, whereNameValues);
    }
}
