package WebApi.Actions

import java.io.InputStream

import Entity.Application.Response
import Utility.{Common, JsonParse}
import com.sun.net.httpserver.HttpExchange

import scala.io.Codec


/**
  * Created by BianzhaiWang on 2017/1/18.
  */
class Request(httpExchange: HttpExchange) {
  var EntityName: String = ""
  var MethodName: String = ""
  var RequestContent: String = ""

  this.Init()

  private def Init(): Unit = {
    val path = httpExchange.getRequestURI().getPath()
    SetEntityMethodName(path)

    val inputStream = httpExchange.getRequestBody()
    SetRequestContent(inputStream)
  }

  private  def SetRequestContent(inputStream: InputStream):Unit= {
    var inputBytes = Array[Byte]()

    var i = 0
    while (i != -1) {
      i = inputStream.read()
      if (i >= 0) {
        inputBytes = inputBytes :+ i.asInstanceOf[Byte]
      }
    }

    this.RequestContent = String.join("", Codec fromUTF8 (inputBytes))
  }

  private def SetEntityMethodName(path: String): Unit = {
    val names = path.substring(1).split("/")
    if (names.length > 2) {
      this.EntityName = names.apply(1)
      this.MethodName = names.apply(2)
    }
  }
}

object Request {
  var ActionClassList = Map[String, Class[_]]()
  ActionClassList += ("User" -> classOf[User])

  def GetActionType(entityName: String): Class[_] = {
    if (Common.StringIsNullOrEmpty(entityName)) {
      return null
    }

    val kv = ActionClassList.filter(m => m._1.toLowerCase().equals(entityName.toLowerCase()))
    kv match {
      case x if x.isEmpty => null
      case _ => kv.head._2
    }
  }

  def GetExceptionJson(message: String): String = {
    val response = new Response()
    response.Ack.IsSuccess = false
    response.Ack.Message = if (Common.StringIsNullOrEmpty(message)) "服务异常！" else message
    response.Ack.StatusCode = 101

    try {
      return JsonParse.ToJson(response)
    } catch {
      case ex: Exception => message
    }
  }
}
