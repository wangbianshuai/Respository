package WebApi.Actions;

import Entity.Application.Response;
import Utility.Common;
import Utility.JsonParse;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class Request {
    public String EntityName = "";
    public String MethodName = "";
    public String RequestContent = "";
    public HttpServletRequest ServletRequest = null;

    public static Map<String, Class> ActionClassList = null;

    static {
        ActionClassList = new HashMap<String, Class>();

        AddActionClassType(User.class);
    }

    private static void AddActionClassType(Class type) {
        String name = type.getTypeName();
        String[] names = name.split("\\.");
        if (names.length > 0) {
            name = names[names.length - 1];
        }
        ActionClassList.put(name, type);
    }

    public static Class GetActionType(String name) {
        Class type = null;

        for (Map.Entry<String, Class> kvp : ActionClassList.entrySet()) {
            if (kvp.getKey().toLowerCase().equals(name.toLowerCase())) {
                type = kvp.getValue();
                break;
            }
        }

        if (type != null) {
            return type;
        }
        return null;
    }

    public static String GetExceptionJson(String message) {
        Response response = new Response();
        response.Ack.IsSuccess = false;
        response.Ack.Message = Common.StringIsNullOrEmpty(message) ? "服务异常！" : message;
        response.Ack.StatusCode = 101;

        try {
            return JsonParse.ToJson(response);
        } catch (Exception ex) {
            return message;
        }
    }
}
