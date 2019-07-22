package WebApi;
import OpenDataAccess.Service.Request;
import OpenDataAccess.Service.RequestHandler;
import OpenDataAccess.Utility.AppSettings;
import OpenDataAccess.Utility.Common;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


@WebServlet("/api/*")
public class DefaultServlet extends HttpServlet {

    @Override
    public void init() {
        ServletContext context = this.getServletContext();
        AppSettings.ConnectionString = context.getInitParameter("ConnectionString");
        AppSettings.DbUser = context.getInitParameter("DbUser");
        AppSettings.DbPassword = context.getInitParameter("DbPassword");
        AppSettings.IsLog = context.getInitParameter("IsLog");
        AppSettings.ServerClient = context.getInitParameter("ServerClient");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        InvokeAction(request, response);
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        InvokeAction(request, response);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        InvokeAction(request, response);
    }

    private  void  InvokeAction(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException{
        response.setContentType("application/json;charset=utf-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();
        try {
            Request req = ServiceRequest.GetRequest(request);

            //获取实体与方法名
            GetEntityMethodName(request, req);

            out.print(new RequestHandler().ProcessRequest(req, req.EntityName, req.MethodName));

        } catch (Exception ex) {
            out.print(ServiceRequest.GetExceptionJson(Common.GetRealException(ex.getCause()).getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        InvokeAction(request, response);;
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
