
import Utility.{Common, JsonParse, LoginRequest}

import scala.util.parsing.json.JSON
import scala.reflect.runtime.universe._

/**
  * Created by Bianshuai on 2017/1/12.
  */
object HelloWorld {

  def main(args: Array[String]): Unit = {
    var json = "[{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"},{\"LoginName\":\"admin\",\"LoginPassword\":\"admin\"}]";

    json = "{\"LoginName\":\"admin\",\"UserTypes\":[1,2,3,4],\"LoginPassword\":\"admin\",\"UserList\":" + json + "}";

    println(json)

    var a="1234"
    var b= Common.ChangeType(Int.getClass(),a).asInstanceOf[Int]
    println(b+123)

    var startMills:Double=0

    var opt: Option[Any] =None


    var loginReqeust=JsonParse.JsonToEntity[LoginRequest](new LoginRequest().getClass(),json)

    startMills = System.currentTimeMillis()
    json= JsonParse.ToJson(loginReqeust)
    printf("JSON序列化耗时%s \n", System.currentTimeMillis() - startMills)
    println(json)

    try {
      startMills = System.currentTimeMillis()
      opt = JsonParse.JsonToMap(json)
      printf("JSON解析耗时%s \n", System.currentTimeMillis() - startMills)
      opt match {
        case Some(s) => foreachJson(s)
        case None => println("JSON字符串格式不正确！")
      }
    }
    catch {
      case ex:Exception=> println(ex.getMessage())
    }

    startMills = System.currentTimeMillis()
    opt= JSON.parseFull(json)
    printf("JSON解析耗时%s \n", System.currentTimeMillis() - startMills)

    opt match {
      case Some(s) => foreachJson(s)
      case None => println("JSON字符串格式不正确！")
    }

    var list=List("abc", "123")

    list= list :+"defg"
    list= list :+"456"

    for( str <- list)
    {
      println(str)
    }

    val list2: List[Map[String, Any]] = List[Map[String, Any]]()
    if (list.isInstanceOf[List[_]] && !list.isEmpty && list.head.isInstanceOf[String]) {
      //println("List[String]")
    }

    //println(patternMatch(list))

    val list3: List[Any] = list;

    list match {
      //case x =>println(x)
      case _ =>
    }


    list3 match {
      //case List(x:String) => list3.foreach((y:Any)=> println(y))
      case _ =>
    }


    if (list2.isInstanceOf[List[_]]) {

      //println("List[Double]")
    }

    var i: Int = 0
    for (i <- 1 to 10) {
      println(Common.CreateGuid())
    }
  }

  def patternMatch[A: TypeTag](xs: List[A]): Boolean = typeOf[A] match {
    //利用类型约束进行精确匹配
    case t if t =:= typeOf[Double] => true
    case _ => false
  }

  def foreachJson(s: Any): Unit = {
    if (s.isInstanceOf[Map[_, _]]) {
      val map: Map[String, Any] = s.asInstanceOf[Map[String, Any]]

      PrintMap(map)
    }

    def PrintMap(map: Map[String, Any]): Unit = {
      map.foreach { case (key: String, value: Any) =>
        value match {
          case x: String => printf("%s:%s \n", key, x)
          case x: List[_] => PrintListMap(x)
          case x: Map[_, _] => PrintMap2(x)
          case _ =>
        }
      }
    }

    def PrintMap2(map: Map[_, _]): Unit = {
      val map2 = map.asInstanceOf[Map[String, Any]]
      PrintMap(map2)
    }

    def PrintListMap(list: List[_]): Unit = {
      list.foreach((x: Any) => x match {
        case y: Double => println(y)
        case y: Int => println(y)
        case y: Map[_, _] => PrintMap2(y)
        case _ =>
      })
    }
  }
}
