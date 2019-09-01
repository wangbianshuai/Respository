package OpenDataApi.infrastructure;

import OpenDataAccess.Utility.Common;
import OpenDataAccess.Utility.EnDecrypt;
import OpenDataAccess.Utility.JsonParse;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class UserToken {
    private static final String _DesKey = "userlogintokedeskey12345";
    private static final long _Exprie = 86400000;

    public static String CreateToken(String userId) {
        Map<String, Object> map = new HashMap<>();
        map.put("UserId", userId);
        map.put("LoginDate", new Date());
        try {
            return EnDecrypt.DesEncrypt(JsonParse.ToJson(map), _DesKey);
        } catch (Exception ex) {
            return "";
        }
    }

    public static String ParseToken(String token) {
        if (Common.IsNullOrEmpty(token)) return "";
        String content = EnDecrypt.DesDecrypt(token, _DesKey);
        try {
            Map<String, Object> map = JsonParse.JsonToDictionary(content);
            Date loginDate = (Date) Common.ChangeType(Date.class, map.get("LoginDate"));
            if (loginDate.getTime() + _Exprie > new Date().getTime()) return (String) map.get("UserId");
            return "";
        } catch (Exception ex) {
            return "";
        }
    }
}
