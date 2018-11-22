import Uitility.JsonParse;
import Uitility.LoginRequest;

import java.util.*;

/**
 * Created by Bianshuai on 2017/1/9.
 */
public class JsonTest {

    public static void main(String[] args) {
        String json = "[{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"},{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"}]";

        json = "{\"LoginName\":\"admin\",\"UserTypes\":[1,2,3,4],\"LoginPassword\":\"admin\",\"UserList\":" + json + "}";
        System.out.println(json);

        try {

            List<LoginRequest> list = JsonParse.JsonToList(LoginRequest.class, json);

            if (list != null && !list.isEmpty()) {
                json = JsonParse.ToJson(list);
                System.out.println(json);
            }

            LoginRequest loginRequest = JsonParse.JsonTo(LoginRequest.class, json);

            if (loginRequest != null) {
                json = JsonParse.ToJson(loginRequest);
                System.out.println(json);
            }

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }
}
