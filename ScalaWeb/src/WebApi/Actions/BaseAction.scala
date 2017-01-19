package WebApi.Actions

import Utility.{Common, JsonParse}

/**
  * Created by BianzhaiWang on 2017/1/18.
  */
class BaseAction extends TAction {

  override def RequestAction(request: Request): String = {
    if (request.MethodName == null || request.MethodName.isEmpty()) {
      return ""
    }

    try {
      val method = this.getClass().getMethod(request.MethodName.toLowerCase(), classOf[Request])
      if (method != null) {
        val obj = method.invoke(this, request)
        if (obj != null) {
          return JsonParse.ToJson(obj)
        }
      }

      return ""
    }
    catch {
      case ex: Exception => Request.GetExceptionJson(Common.GetRealException(ex).getMessage())
    }
  }
}
