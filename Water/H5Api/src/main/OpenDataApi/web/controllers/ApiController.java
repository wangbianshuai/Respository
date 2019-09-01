package OpenDataApi.web.controllers;

import OpenDataAccess.Service.Request;
import OpenDataAccess.Service.RequestHandler;
import OpenDataAccess.Utility.AppSettings;
import OpenDataAccess.Utility.Common;
import OpenDataApi.infrastructure.UserToken;
import OpenDataApi.web.ServiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ApiController {

    @Autowired
    private HttpServletRequest _Request;

    @GetMapping("/{entityName}")
    public String Get(@PathVariable String entityName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, "", token);
    }

    @GetMapping("/{entityName}/{methodName}")
    public String Get(@PathVariable String entityName, @PathVariable String methodName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, methodName, token);
    }

    @PostMapping("/{entityName}")
    public String Post(@PathVariable String entityName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, "", token);
    }

    @PostMapping("/{entityName}/{methodName}")
    public String Post(@PathVariable String entityName, @PathVariable String methodName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, methodName, token);
    }

    @PutMapping("/{entityName}")
    public String Put(@PathVariable String entityName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, "", token);
    }

    @PutMapping("/{entityName}/{methodName}")
    public String Put(@PathVariable String entityName, @PathVariable String methodName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, methodName, token);
    }

    @DeleteMapping("/{entityName}")
    public String Delete(@PathVariable String entityName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, "", token);
    }

    @DeleteMapping("/{entityName}/{methodName}")
    public String Delete(@PathVariable String entityName, @PathVariable String methodName, @RequestHeader(name = "token", required = false) String token) {
        return InvokeAction(entityName, methodName, token);
    }

    private String InvokeAction(String entityName, String methodName, String token) {
        try {
            AppSettings.InvokeConfig = (name) -> OpenDataApi.constants.AppSettings.GetConfig(name);
            Request req = ServiceRequest.GetRequest(_Request);
            req.EntityName = entityName;
            req.MethodName = methodName;
            req.OperationUser = UserToken.ParseToken(token);
            return new RequestHandler().ProcessRequest(req, req.EntityName, req.MethodName);
        } catch (Exception ex) {
            return ServiceRequest.GetExceptionJson(Common.GetRealException(ex.getCause()).getMessage());
        }

    }
}
