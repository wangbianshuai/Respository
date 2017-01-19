package WebApi

import java.net.InetSocketAddress

import com.sun.net.httpserver.spi.HttpServerProvider

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
object WebServerHost {

  def main(args: Array[String]): Unit = {
    try {
      val provider: HttpServerProvider = HttpServerProvider.provider()
      val httpServer = provider.createHttpServer(new InetSocketAddress(8089), 100)
      httpServer.createContext("/api", new ApiHttpHandler())
      httpServer.setExecutor(null)
      httpServer.start()

      println("Server Started")
    }
    catch {
      case ex: Exception => ex.printStackTrace()
    }
  }
}
