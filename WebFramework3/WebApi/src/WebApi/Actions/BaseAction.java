package WebApi.Actions;

import Utility.Common;
import Utility.JsonParse;
import org.jetbrains.annotations.NotNull;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Method;

/**
 * Created by Bianshuai on 2017/1/8.
 */
public class BaseAction implements IAction {

    // 请求行为实现
    public String RequestAction(@NotNull Request request) {
        if (request.MethodName == null || request.MethodName.isEmpty()) {
            return "";
        }

        try {
            request.RequestContent = Common.InputStream2String(request.ServletRequest.getInputStream());
            Method method = this.getClass().getMethod(request.MethodName.toLowerCase(), Request.class);
            if (method != null) {
                Object obj = method.invoke(this, request);
                if (obj != null) {
                    return JsonParse.ToJson(obj);
                }
            }
        } catch (Exception ex) {
            return Request.GetExceptionJson(Common.GetRealException(ex.getCause()).getMessage());
        }
        return "";
    }
}
