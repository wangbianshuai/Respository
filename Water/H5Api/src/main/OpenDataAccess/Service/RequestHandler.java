package OpenDataAccess.Service;

import OpenDataAccess.Entity.*;
import OpenDataAccess.Utility.Common;
import OpenDataAccess.Utility.JsonParse;
import OpenDataAccess.Utility.Stopwatch;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.util.*;

public class RequestHandler {
    public String ProcessRequest(Request request, String entityName, String methodName) {
        request.StartTime = new Date();
        Stopwatch sw = new Stopwatch();
        sw.Start();

        String responseContent = "";
        Object obj = null;

        try {
            String put = request.QueryString.get("$put");
            String get = request.QueryString.get("$get");
            String delete = request.QueryString.get("$delete");
            if (Common.IsEquals(put, "true",true)) {
                request.RequestType = "PUT";
            } else if (Common.IsEquals(get , "true",true)) {
                request.RequestType = "GET";
            } else if (Common.IsEquals( delete, "true",true)) {
                request.RequestType = "DELETE";
            }
            if (Common.IsNullOrEmpty(entityName)) {
                String[] names = request.PathInfo.split("/");
                request.EntityName = names[0];
                if (names.length > 1) {
                    request.MethodName = names[1];
                }
            } else {
                request.EntityName = entityName;
                request.MethodName = methodName;
            }
            this.SetEntityAndMethodName(request, request.EntityName, request.MethodName);

            if (JudgeRight(request) || (request.IsDirectRequest != null && request.IsDirectRequest.Invoke())) {
                obj = this.InvokeMethod(request);
                responseContent = Parse.ToJson(obj);
            } else {
                Map<String, Object> map = new HashMap<>();
                map.put("Message", "登录信息过期，请重新登录！");
                map.put("IsLogin", false);
                responseContent = JsonParse.ToJson(map);
            }
        } catch (Exception ex) {
            Map<String, Object> dict = new HashMap<>();

            request.Excption = ex;
            String msg = Common.GetRealException(ex).getMessage();
            dict.put("Exception", Common.IsNullOrEmpty(msg) ? "请求异常" : msg);

            obj = dict;
            try {
                responseContent = JsonParse.ToJson(dict);
            } catch (Exception ex2) {
                responseContent = "{\"Exception\":\"" + ex2.getMessage() + "\"}";
            }
        }

        request.EndTime = new Date();
        sw.Stop();
        request.ElapsedMilliseconds = sw.ElapsedMilliseconds();

        if (!Common.IsNullOrEmpty(request.EntityName)) {
            RequestLog.AddRequestLog(request, obj, responseContent);
        }

        return responseContent;
    }

    boolean JudgeRight(Request request) throws MalformedURLException {

        if (Common.IsEquals(request.EntityName, "TestUser", true) && Common.IsEquals(request.MethodName, "login", true))
            return true;

        String userId = request.GetParameterValue("LoginUserId");
        String token = request.GetParameterValue("Token");
        //if (Common.IsNullOrEmpty(userId) || Common.IsNullOrEmpty(token)) return false;

        return true;
    }

    private void SetEntityAndMethodName(Request request, String entityName, String methodName) {
        int startIndex = 0;
        if (!Common.IsNullOrEmpty(entityName)) {
            request.EntityName = entityName;
            startIndex = request.EntityName.indexOf("(");
            if (startIndex > 0) {
                request.EntityName = request.EntityName.substring(0, startIndex);
            }
        }
        if (!Common.IsNullOrEmpty(methodName)) {
            request.MethodName = methodName;
            startIndex = request.MethodName.indexOf("(");
            if (startIndex > 0) {
                request.MethodName = request.MethodName.substring(0, startIndex);
            }
        }
    }

    private Object InvokeMethod(Request request) throws Exception {
        EntityRequest entityRequest = null;

        if (Common.IsNullOrEmpty(request.EntityName)) {
            return null;
        }

        if (request.RequestType == null) request.RequestType = "";
        String pdata = request.QueryString.get("$data");
        if (Common.IsNullOrEmpty(request.Content) && (request.RequestType.equals("POST") || request.RequestType.equals("PUT")
                || (request.RequestType.equals("DELETE") && Common.IsEquals(pdata, "true", true)))) {
            request.IsLog = false;
            Map<String, Object> dict = new HashMap<>();
            dict.put("NoData", true);
            return dict;
        }

        EntityType entityType = null;

        if (RequestLog.IsLog) {
            entityType = EntityType.GetEntityType("OperationLog", false);
            if (entityType != null) {
                request.OperationLogEntity = entityType;
            }
        }

        if (request.EntityName.equals("$entity")) {
            return this.GetEntityInfo();
        }

        String classNamespace = "";

        entityType = EntityType.GetEntityType(request.EntityName, false);
        if (entityType == null) {
            throw new Exception("实体不存在！");
        }
        request.Entity = entityType;
        request.Entities = this.GetEntities(request);

        Object returnObj = null;

        if (!Common.IsNullOrEmpty(request.MethodName)) {
            Class<?> type = ComponentType.GetComponentType(request.EntityName);
            if (type == null) {
                throw new Exception("实体不存在！");
            }
            Constructor instanceObj = type.getConstructor(new Class[]{Request.class});
            entityRequest = (EntityRequest) instanceObj.newInstance(new Object[]{request});

            Method method = type.getMethod(request.MethodName);
            if (method != null) {
                INoLogAttribute log = method.getAnnotation(INoLogAttribute.class);
                request.IsLog = log == null;
                returnObj = method.invoke(entityRequest);
            } else throw new Exception("方法不存在！");
        } else {
            switch (request.RequestType) {
                case "GET": {
                    if (!request.Entity.IsGet) {
                        throw new Exception("请求不允许！");
                    }
                    entityRequest = new EntityRequest(request);
                    returnObj = entityRequest.Select();
                    break;
                }
                case "POST": {
                    entityRequest = new EntityRequest(request);
                    if (entityRequest.GetQueryRequest().IsQuery) {
                        request.IsPostQuery = true;
                        returnObj = entityRequest.Select();
                    } else {
                        if (!request.Entity.IsPost) {
                            throw new Exception("请求不允许！");
                        }
                        returnObj = entityRequest.Insert();
                    }
                    break;
                }
                case "PUT": {
                    if (!request.Entity.IsPut) {
                        throw new Exception("请求不允许！");
                    }
                    entityRequest = new EntityRequest(request);
                    returnObj = entityRequest.Update();
                    break;
                }
                case "DELETE": {
                    if (!request.Entity.IsDelete) {
                        throw new Exception("请求不允许！");
                    }
                    entityRequest = new EntityRequest(request);
                    returnObj = entityRequest.Delete();
                    break;
                }
                default: {
                    throw new IllegalArgumentException();
                }
            }
        }
        return returnObj;
    }

    private Object GetEntityInfo() {
        Map<String, Object> dict = new HashMap<>();
        EntityType.EntityTypeList.forEach(entity ->
        {
            Map<String, Object> entityDict = new HashMap<>();
            entityDict.put("Name", entity.Name);
            entityDict.put("PrimaryKey", entity.PrimaryKey);
            List<Map<String, Object>> propertyList = new ArrayList<>();
            entity.Properties.forEach(property ->
            {
                Map<String, Object> propertyDict = new HashMap<>();
                propertyDict.put("Name", property.Name);
                propertyDict.put("Type", property.Type.getSimpleName());
                propertyList.add(propertyDict);
            });
            entityDict.put("Properties", propertyList);
            dict.put(entity.Name, entityDict);
        });
        return dict;
    }

    private Map<String, List<IEntityData>> GetEntities(Request request) throws IOException, Exception {
        if (!Common.IsNullOrEmpty(request.Content)) {
            Map<String, List<IEntityData>> entityDict = new HashMap<>();
            Map<String, Object> dict = JsonParse.JsonToDictionary(request.Content);
            if (dict != null) {
                for (Map.Entry<String, Object> kvp : dict.entrySet()) {
                    entityDict.put(kvp.getKey(), Parse.MapListToIEntityDataList(Parse.ToDictionaryList(kvp.getValue())));
                }
                return entityDict;
            }
        }
        return null;
    }
}
