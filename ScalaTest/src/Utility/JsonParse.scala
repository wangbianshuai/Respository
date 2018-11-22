package Utility

import java.lang.reflect.{Field, Method, ParameterizedType}

import scala.io.Codec
import java.text.SimpleDateFormat
import java.util.Date
/**
  * Created by Bianshuai on 2017/1/15.
  */
object JsonParse {

  private final val FormatMessage = "JSON字符串格式不正确"

  def ToJson(obj: Any): String = {
    if (obj == null) {
      return ""
    }
    return GetOutputString(obj)
  }

  private def GetOutputString(obj: Any): String = {
    obj match {
      case x: List[_] => ToJsonByList(x)
      case x: Map[_, _] => ToJsonByMap(x.asInstanceOf[Map[String, Any]])
      case x: Array[_] => ToJsonByList(x.toList)
      case _ => GetBaseTypeJson(obj)
    }
  }

  private def ToJsonByMap(map: Map[String, Any]): String = {
    var itemList = List[String]()

    for ((k, v) <- map) {
      if (v == null) {
        itemList = itemList :+ String.format("\"%s\":null", Encode(k))
      } else {
        itemList = itemList :+ String.format("\"%s\":%s", Encode(k), GetOutputString(v))
      }
    }

    return String.format("{%s}", Common.StringJoin(",", itemList))
  }

  private def ToJsonByList(list: List[_]): String = {
    var itemList = List[String]()

    for (item <- list) {
      itemList = itemList :+ GetOutputString(item)
    }

    return String.format("[%s]", Common.StringJoin(",", itemList))
  }

  private def GetBaseTypeJson(obj: Any): String = {
    var output = ""
    val value = GetBaseTypeValue(obj)

    if (value != null) {
      output = value
    } else {
      output = ToJsonByObject(obj)
    }
    return output
  }

  private def ToJsonByObject(obj: Any): String = {
    val cls = obj.getClass()
    val methodList = cls.getMethods()
    val getMethodNameList = methodList.filter(m => m.getName().endsWith("_$eq")).map(m => m.getName().replace("_$eq", ""))
    val getMethodList = methodList.filter(m => getMethodNameList.contains[String](m.getName()))

    var itemList = List[String]()
    var value: Any = null
    var key: String = null

    for (method <- getMethodList) {
      key = method.getName()
      value = method.invoke(obj)

      if (value == null) {
        itemList = itemList :+ String.format("\"%s\":null", key)
      } else {
        itemList = itemList :+ String.format("\"%s\":%s", key, GetOutputString(value))
      }
    }

    return String.format("{%s}", Common.StringJoin(",", itemList))
  }

  private def GetBaseTypeValue(obj: Any): String = {
    obj match {
      case x: Byte => x.toString()
      case x: Char => String.format("\"%s\"", x.toString())
      case x: Short => x.toString()
      case x: Int => x.toString()
      case x: Long => x.toString()
      case x: Float => x.toString()
      case x: Double => x.toString()
      case x: Boolean => if (x) "true" else "false"
      case x: Date => GetDateString(x)
      case x: String => String.format("\"%s\"", Encode(x))
      case _ => null
    }
  }

  private def GetDateString(date: Date): String = {
    val sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    return String.format("\"%s\"", sdf.format(date.asInstanceOf[Date]));
  }

  private def Encode(str: String): String = {
    val input = str.getBytes()
    var output = Array[Byte]()

    val setEncode = (b: Byte, c: Char) => {
      c match {
        case '\\' => output = output ++ "\\\\".getBytes()
        case '"' => output = output ++ "\\\"".getBytes()
        case '\n' => output = output ++ "\\n".getBytes()
        case '\r' => output = output ++ "\\r".getBytes()
        case '\f' => output = output ++ "\\f".getBytes()
        case '\b' => output = output ++ "\\b".getBytes()
        case '\t' => output = output ++ "\\t".getBytes()
        case _ => output = output :+ b
      }
    }

    for (b <- input) setEncode(b, b.asInstanceOf[Char])

    return String.join("", Codec fromUTF8 (output))
  }

  def JsonToMap(jsonString: String): Option[Map[String, Any]] = {
    val opt = JsonToList(jsonString)
    opt match {
      case Some(list) => list.size match {
        case x if x > 0 => Some(list.apply(0))
        case _ => None
      }
      case None => None
    }
  }

  def JsonToList(jsonString: String): Option[List[Map[String, Any]]] = {
    val anyList = JsonToAnyList(jsonString)
    anyList match {
      case Some(x) => AnyListToMapList(x)
      case None => None
    }
  }

  def JsonToAnyList(jsonString: String): Option[List[Any]] = {
    if (Common.StringIsNullOrEmpty(jsonString)) {
      return None
    }

    //去前后空格与回车转义符
    var jsonStr = TrimWhiteEnter(jsonString)

    if (jsonStr.equals("{}")) {
      return Some(List[Any](Map[String, Any]()))
    }

    if (jsonStr.equals("[]")) {
      return Some(List[Any]())
    }

    CheckJsonFormat(jsonStr)

    //字符串属性名或值
    var strList = Map[String, String]()
    jsonStr = GetStringList(jsonStr, (key, value) => strList += (key -> value))

    //Object字符串
    var objList = Map[String, String]()

    var iCount = 0
    var iCount2 = 0
    do {
      iCount = iCount2
      jsonStr = GetObjectJsonStringList(jsonStr, false, (key, value) => objList += (key -> value))
      iCount2 = objList.size
    }
    while (iCount < iCount2)

    //数组字符串
    var arrayList = Map[String, String]()
    jsonStr = GetArrayStringList(arrayList, jsonStr, (list) => arrayList = list)

    //Object中的数组
    for ((k, v) <- objList) {
      objList += (k -> GetArrayStringList(arrayList, v, (list) => arrayList = list))
    }

    if (!arrayList.isEmpty || !objList.isEmpty) {
      var keyList = arrayList.keys.toList
      keyList = keyList ++ objList.keys.toList

      return Some(GetAnyList(jsonStr, keyList, arrayList, objList, strList))
    }

    return None
  }

  def JsonToEntityList[T](cls: Class[_], jsonString: String): List[T] = {
    val opt = JsonToList(jsonString)
    opt match {
      case Some(list) => for (map <- list) yield MapToEntity[T](cls, map)
      case None => null
    }
  }

  def JsonToEntity[T](cls: Class[_], jsonString: String): T = {
    val opt = JsonToMap(jsonString)
    opt match {
      case Some(map) => MapToEntity[T](cls, map)
      case None => null.asInstanceOf[T]
    }
  }

  def ListToEntityList[T](cls: Class[_], list: List[Map[String, Any]]): List[T] = {
    for (map <- list) yield MapToEntity[T](cls, map)
  }

  def MapToEntity[T](cls: Class[_], map: Map[String, Any]): T = {
    return MapToObject(cls, map).asInstanceOf[T]
  }

  private def ListToObjectList(cls: Class[_], list: List[_]): List[Any] = {
    for (obj <- list)
      yield obj match {
        case x: List[_] => obj
        case x: Map[_, _] => MapToObject(cls, x.asInstanceOf[Map[String, Any]])
        case _ => Common.ChangeType(cls, obj)
      }
  }

  private def MapToObject(cls: Class[_], map: Map[String, Any]): Any = {
    if (map == null) {
      return null
    }

    val obj = cls.newInstance()
    val methodList = cls.getMethods().filter(m=>m.getName().endsWith("_$eq"))


    for (m <- methodList) SetObjectValue(obj, m, map)

    return obj
  }

  private def SetObjectValue(obj: Any, method: Method, map: Map[String, Any]): Unit = {
    var value: Any = null
    val kv = map.filter(p => String.format("%s_$eq", p._1).toLowerCase().equals(method.getName().toLowerCase()))
    if (!kv.isEmpty) {
      value = kv.head._2
    }

    value match {
      case null => method.invoke(obj, null)
      case x: List[_] => method.invoke(obj, GetListValue(method, x))
      case x: Map[_, _] => method.invoke(obj, MapToObject(method.getParameterTypes().apply(0), x.asInstanceOf[Map[String, Any]]).asInstanceOf[AnyRef])
      case x: Array[_] => method.invoke(obj, GetListValue(method, x.toList))
      case _ => method.invoke(obj, Common.ChangeType(method.getParameterTypes().apply(0), value).asInstanceOf[AnyRef])
    }
  }

  private def GetListValue(method: Method, list: List[_]): AnyRef = {
    val fieldType = method.getParameterTypes.apply(0)
    if (fieldType.isArray()) {
      return Common.ChangeArrayType(fieldType, list.toArray)
    }
    else {
      val pt = method.getGenericParameterTypes().apply(0).asInstanceOf[ParameterizedType]
      val cls = pt.getActualTypeArguments().apply(0).asInstanceOf[Class[_]]
      return ListToObjectList(cls, list)
    }
  }

  private def AnyListToMapList(list: List[Any]): Option[List[Map[String, Any]]] = {
    var mapList = List[Map[String, Any]]()
    for (a <- list) {
      a match {
        case x: Map[_, _] => mapList = mapList :+ x.asInstanceOf[Map[String, Any]]
        case _ =>
      }
    }
    return Some(mapList)
  }

  private def GetAnyList(jsonString: String, keyList: List[String], arrayList: Map[String, String], objList: Map[String, String], strList: Map[String, String]): List[Any] = {
    val strArray = jsonString.split(",")

    if (keyList != null) {
      CheckKeyExists(strArray, keyList)
    }

    var list = List[Any]()

    for (str <- strArray) {
      list = list :+ GetObjectValue(TrimWhiteEnter(str), arrayList, objList, strList)
    }

    if (keyList != null && list.size == 1 && list.apply(0).isInstanceOf[List[_]]) {
      return list.apply(0).asInstanceOf[List[Any]]
    }
    return list
  }

  private def GetObjectValue(value: String, arrayList: Map[String, String], objList: Map[String, String], strList: Map[String, String]): Any = {
    var objValue: Any = null
    var value2: String = null

    //字符串值
    if (value.startsWith("str") && value.length() == 35) {
      value2 = strList.apply(value)
    }
    if (value2 != null) {
      objValue = value2
    } else {
      //数组值
      if (value.startsWith("arr") && value.length() == 35) {
        value2 = arrayList.apply(value)
      }
      if (value2 != null) {
        objValue = GetAnyList(value2, null, arrayList, objList, strList)
      } else {
        //Object值
        if (value.startsWith("obj") && value.length() == 35) {
          value2 = objList.apply(value)
        }
        if (value2 != null) {
          //Object
          objValue = GetDictionary(value2, arrayList, objList, strList)
        }
      }
    }
    if (value2 == null) {
      //boolean、int、double,null
      objValue = GetJsonValue(value)
    }

    return objValue
  }

  private def GetJsonValue(value: String): Any = {
    if (Common.StringIsNullOrEmpty(value) || value.toLowerCase().equals("null")) {
      return null
    }
    if (value.toLowerCase().equals("true")) {
      return true
    }
    if (value.toLowerCase().equals("false")) {
      return false
    }

    if (Common.CheckDouble(value)) {
      return value.toDouble
    }

    if (Common.CheckNumber(value)) {
      val lv = value.toLong
      if (lv <= Integer.MAX_VALUE && lv >= Integer.MIN_VALUE) {
        return lv.asInstanceOf[Int]
      }
      return lv
    }

    return value
  }

  private def GetDictionary(jsonString: String, arrayList: Map[String, String], objList: Map[String, String], strList: Map[String, String]): Map[String, Any] = {
    val strArray = jsonString.split(",")

    var map = Map[String, Any]()

    var kv = Array[String]()
    var key = ""
    var value = ""
    var keyValue = ""

    for (str <- strArray) {
      kv = str.split(":")

      if (kv.length != 2) {
        throw new Exception(FormatMessage)
      }

      key = TrimWhiteEnter(kv.apply(0))
      value = TrimWhiteEnter(kv.apply(1))

      keyValue = strList.apply(key)
      if (Common.StringIsNullOrEmpty(keyValue)) {
        keyValue = key
      }

      map += (keyValue -> GetObjectValue(value, arrayList, objList, strList))
    }

    return map
  }

  private def CheckKeyExists(strArray: Array[String], keyList: List[String]): Unit = {
    for (str <- strArray) {
      if (!keyList.contains(str)) {
        throw new Exception(FormatMessage)
      }
    }
  }

  private def GetArrayStringList(arrayList: Map[String, String], jsonString: String, addList: (Map[String, String]) => Unit): String = {
    var arrayList2 = arrayList
    var jsonStr = jsonString
    var iCount = 0
    var iCount2 = 0
    do {
      iCount = iCount2
      jsonStr = GetObjectJsonStringList(jsonStr, true, (key, value) => arrayList2 += (key -> value))
      iCount2 = arrayList2.size
    }
    while (iCount < iCount2)

    addList(arrayList2)
    return jsonStr
  }

  private def TrimWhiteEnter(str: String): String = {
    val str2 = Common.StringTrim(str)
    return Common.StringTrimEnter(str2)
  }

  private def CheckJsonFormat(jsonString: String): Unit = {
    if (!JudgeStartEnd(jsonString)) {
      throw new Exception(FormatMessage)
    }
  }

  private def JudgeStartEnd(jsonString: String): Boolean = {
    var blSuccess = true

    if (!jsonString.startsWith("{") && !jsonString.startsWith("[") && !jsonString.endsWith("}") && !jsonString.endsWith("]")) {
      blSuccess = false
    }
    if (blSuccess && jsonString.startsWith("{") && !jsonString.endsWith("}")) {
      blSuccess = false
    }
    if (blSuccess && jsonString.startsWith("[") && !jsonString.endsWith("]")) {
      blSuccess = false
    }

    return blSuccess
  }

  private def GetStringList(jsonStr: String, addMap: (String, String) => Unit): String = {
    val input = jsonStr.getBytes()
    var output = Array[Byte]()
    var output2: Array[Byte] = null

    var c = '\0'
    var preChar = '\0'
    var index = 0
    var blStart = false
    var blStart2 = false
    var keyValue = ""
    var value = ""

    for (b <- input) {
      c = b.asInstanceOf[Char]

      if (!blStart) {
        blStart = preChar != '\\' && c == '"'
        if (blStart) {
          blStart2 = true
        }
      }

      if (blStart) {
        if (blStart2) {
          output2 = Array[Byte]()
        }
      } else {
        output = output :+ b
      }

      if (output2 != null) {
        output2 = output2 :+ b
      }

      if (blStart && !blStart2 && preChar != '\\' && c == '"') {
        blStart = false
        keyValue = String.format("str%s", Common.CreateGuid().replace("-", ""))
        output = output ++ keyValue.getBytes()

        value = String.join("", Codec fromUTF8 (output2))
        addMap(keyValue, value.substring(1, value.length() - 1))
        output2 = null
      }
      preChar = c
      blStart2 = false
    }

    return String.join("", Codec fromUTF8 (output))
  }

  private def GetObjectJsonStringList(jsonStr: String, blArray: Boolean, addMap: (String, String) => Unit): String = {
    if (!JudgeStartEnd(jsonStr)) {
      return jsonStr
    }

    val input = jsonStr.getBytes()
    var output = Array[Byte]()
    var output2: Array[Byte] = null

    var c = '\0'
    var keyValue = ""
    var value = ""
    var sc = '{'
    if (blArray) {
      sc = '['
    }
    var ec = '}'
    if (blArray) {
      ec = ']'
    }

    for (b <- input) {
      c = b.asInstanceOf[Char]

      if (c == sc) {
        if (output2 != null) {
          output = output ++ output2
        }
        output2 = Array[Byte]()
      }

      if (output2 != null) {
        output2 = output2 :+ b
      } else {
        output = output :+ b
      }

      if (output2 != null && c == ec) {
        keyValue = String.format("%s%s", blArray match {
          case true => "arr"
          case false => "obj"
        }, Common.CreateGuid().replace("-", ""))
        output = output ++ keyValue.getBytes()

        value = String.join("", Codec fromUTF8 (output2))
        addMap(keyValue, value.substring(1, value.length() - 1));
        output2 = null
      }
    }

    return String.join("", Codec fromUTF8 (output))
  }
}
