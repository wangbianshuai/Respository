package HttpHandlers

import com.sun.net.httpserver.{HttpExchange, HttpHandler}

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
class ApiHttpHandler extends HttpHandler {

  override def handle(httpExchange: HttpExchange): Unit = {
    println("Api Http Handler Start")

    var resp = "Api Http Handler Start"
    httpExchange.sendResponseHeaders(200, resp.getBytes().length)

    val outputStream = httpExchange.getResponseBody()
    outputStream.write(resp.getBytes())

    outputStream.flush()
    httpExchange.close()
  }
}
