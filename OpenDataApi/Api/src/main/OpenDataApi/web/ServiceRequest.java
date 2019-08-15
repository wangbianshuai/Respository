package OpenDataApi.web;

import OpenDataAccess.Entity.EntityType;
import OpenDataAccess.Service.ComponentType;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.IEntityRequest;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Utility.Common;
import OpenDataAccess.Utility.JsonParse;
import OpenDataApi.constants.AppSettings;
import OpenDataApi.domain.Entity;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

public class ServiceRequest {
    public String EntityName = "";
    public String MethodName = "";
    public String RequestContent = "";
    public HttpServletRequest ServletRequest = null;

    static {
        try {
            EntityType.SetEntityType(OpenDataApi.models.User.class);
            EntityType.SetEntityType(OpenDataApi.models.Application.class);

            ComponentType.SetComponentType(OpenDataApi.domain.User.class);

            LoadDataEntity();

        } catch (Exception ex) {
        }
    }

    public static void LoadDataEntity() {
        try {
            Entity entity = new Entity();
            entity.SetEntityList(AppSettings.GetConfig("OpenDataAccess.ApplicationId"));


        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public static Request GetRequest(HttpServletRequest request) throws IOException {
        Request req = new Request();
        req.RawUrl = request.getRequestURL().toString();
        req.QueryString = GetQueryString(request);
        req.PathInfo = request.getRequestURI().substring(5);
        req.Content = Common.InputStream2String(request.getInputStream());
        req.RequestType = request.getMethod();
        req.PathAndQuery = req.PathInfo +"?"+ request.getQueryString();
        req.RootPath= request.getSession().getServletContext().getRealPath("");
        req.IPAddress= GetClientIpAddress(request);
        return req;
    }


    private static final String[] HEADERS_TO_TRY = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR",
            "X-Real-IP"};

    public static String GetClientIpAddress(HttpServletRequest request) {
        for (String header : HEADERS_TO_TRY) {
            String ip = request.getHeader(header);
            if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }
        }
        return request.getRemoteAddr();
    }


    public  static Map<String,String> GetQueryString(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        for (Map.Entry<String, String[]> kvp : request.getParameterMap().entrySet()) {
            if (kvp.getValue().length > 0) map.put(kvp.getKey(), kvp.getValue()[0]);
        }
        return map;
    }

    public static String GetExceptionJson(String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("Exception", message);

        try {
            return JsonParse.ToJson(map);
        } catch (Exception ex) {
            return message;
        }
    }
}

