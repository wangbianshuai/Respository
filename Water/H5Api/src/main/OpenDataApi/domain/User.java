package OpenDataApi.domain;

import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;
import OpenDataApi.infrastructure.UserToken;

import java.util.*;

public class User extends EntityRequest {
    public User() {
    }

    public User(Request request) {
        super(request);
    }

    public Object Login() {
        IEntityData entityData = this.GetRequest().Entities.get("User").get(0);

        List<String> fieldList = Arrays.asList(new String[]{"User_Id", "User_Name", "Login_Name", "Last_Login_Date"});
        OpenDataApi.models.User user = this.SelectEntity(OpenDataApi.models.User.class, fieldList, entityData.GetDictionary());
        if (user == null) return GetMessageDict("登录名或密码不正确！");

        UpdateLastLoginDate(user.User_Id);

        user.Token = UserToken.CreateToken(user.User_Id);

        return user;
    }

    private void UpdateLastLoginDate(String userId) {
        Map<String, Object> nameValues = new HashMap<>();
        nameValues.put("Last_Login_Date", new Date());
        nameValues.put("Row_Version", Common.CreateGuid());

        Map<String, Object> where = new HashMap<>();
        where.put("User_Id", userId);

        this.Update(nameValues, where, null);
    }
}
