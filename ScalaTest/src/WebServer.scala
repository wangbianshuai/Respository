import java.net.InetSocketAddress

import HttpHandlers.ApiHttpHandler
import com.sun.net.httpserver.spi.HttpServerProvider

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
object WebServer {

  def main(args: Array[String]): Unit = {
    println("WebServer")
    ServerStart()
  }

  def ServerStart(): Unit = {
    val provider: HttpServerProvider = HttpServerProvider.provider()
    val httpServer = provider.createHttpServer(new InetSocketAddress(8089), 100)
    httpServer.createContext("/api", new ApiHttpHandler())
    httpServer.setExecutor(null)
    httpServer.start()

    println("Server Started")
  }
}
