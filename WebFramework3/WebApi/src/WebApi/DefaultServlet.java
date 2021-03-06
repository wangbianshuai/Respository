package WebApi;

import Utility.AppSettings;
import Utility.Common;
import WebApi.Actions.IAction;
import WebApi.Actions.Request;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Bianshuai on 2017/1/8.
 */
@WebServlet("/api/*")
public class DefaultServlet extends HttpServlet {

    @Override
    public void init() {
        ServletContext context = this.getServletContext();
        AppSettings.ConnectionString = context.getInitParameter("ConnectionString");
        AppSettings.DbUser = context.getInitParameter("DbUser");
        AppSettings.DbPassword = context.getInitParameter("DbPassword");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        try {
            if (AppSettings.ConnectionString == null) {
                AppSettings.ConnectionString = this.getServletContext().getInitParameter("ConnectionString");
            }

            Request req = new Request();

            //获取实体与方法名
            GetEntityMethodName(request, req);

            Class type = Request.GetActionType(req.EntityName);
            if (type != null) {
                IAction action = (IAction) type.newInstance();
                if (action != null) {
                    req.ServletRequest = request;
                    out.print(action.RequestAction(req));
                }
            } else {
                out.print("");
            }
        } catch (Exception ex) {
            out.print(Request.GetExceptionJson(Common.GetRealException(ex.getCause()).getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         response.getWriter().print("Hello Word !");
    }

    public void GetEntityMethodName(HttpServletRequest request, Request req) {
        String path = request.getPathInfo();
        path = path.substring(1);
        String[] strs = path.split("/");
        if (strs.length > 1) {
            req.EntityName = strs[0];
            req.MethodName = strs[1];
        }
    }
}
