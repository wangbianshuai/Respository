package WebApi

import Utility.{AppSettings, Common}
import WebApi.Actions.{Request, TAction}
import com.sun.net.httpserver.{HttpExchange, HttpHandler}

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
class ApiHttpHandler extends HttpHandler {

  override def handle(httpExchange: HttpExchange): Unit = {

    val headers = httpExchange.getResponseHeaders()
    headers.set("Content-Type", "application/json;charset=utf-8")
    headers.set("Access-Control-Allow-Origin", "*")
    var responseString = ""

    try {

      AppSettings.ConnectionString="jdbc:mysql://localhost/sys?user=root&password=123456"

      val request = new Request(httpExchange)

      val cls = Request.GetActionType(request.EntityName)
      if (cls != null) {
        val action = cls.newInstance().asInstanceOf[TAction]
        responseString = action.RequestAction(request)
      }
    }
    catch {
      case ex: Exception => responseString = Request.GetExceptionJson(Common.GetRealException(ex).getMessage())
    }

    httpExchange.sendResponseHeaders(200, responseString.getBytes().length)

    val outputStream = httpExchange.getResponseBody()
    outputStream.write(responseString.getBytes())

    outputStream.flush()
    httpExchange.close()
  }
}